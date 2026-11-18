/* Local QA only. Inject into COPIES of static output; never loaded by production. */
(() => {
 const box=document.createElement('aside');box.id='hero-benchmark';box.style.cssText='position:fixed;z-index:9999;left:12px;bottom:12px;background:#fff;color:#181a22;padding:12px;border:1px solid #294ee8;border-radius:8px;font:12px Arial;max-width:310px;max-height:190px;overflow:auto;box-shadow:0 2px 8px #0002';
 box.innerHTML='<button id="run-hero-benchmark" style="padding:10px;background:#294ee8;color:white;border:0;border-radius:4px">Run hero benchmark</button><p id="benchmark-status">Local QA: 3s warm-up + 14s sample</p><pre id="benchmark-summary" style="white-space:pre-wrap;max-height:65px;overflow:auto"></pre><a id="benchmark-download" hidden>Download raw benchmark</a>';
 document.body.append(box);
 const status=box.querySelector('#benchmark-status'),summary=box.querySelector('#benchmark-summary'),button=box.querySelector('button'),download=box.querySelector('a');
 let run=0;
 const quantile=(values,p)=>{const a=[...values].sort((x,y)=>x-y);return a[Math.min(a.length-1,Math.floor(a.length*p))]??0;};
 button.onclick=async()=>{
  button.disabled=true;summary.textContent='';run++;
  const hero=document.querySelector('.studio-hero');if(!hero){status.textContent='Hero unavailable';button.disabled=false;return;}
  const top=hero.getBoundingClientRect().top+scrollY;
  const distance=Math.max(innerHeight*.65,hero.offsetHeight-innerHeight);
  const phases=[['slow-forward',5000,0,1],['hold-end',1000,1,1],['reverse',3000,1,0],['rapid-forward',1000,0,1],['rapid-reverse',1000,1,0],['hold-start',2000,0,0]];
  const longTasks=[],longFrames=[],frames=[],events=[];let started=0,ended=0,frame=0,previous=0,phaseIndex=0,phaseStart=0;
  let counters={scrollEvents:0,domMutations:0,sceneProgressMutations:0,canvasSizeMutations:0};
  const scroll=()=>counters.scrollEvents++;
  const mutation=new MutationObserver(records=>{for(const record of records){counters.domMutations++;if(record.attributeName==='data-scene-progress')counters.sceneProgressMutations++;if(record.target.tagName==='CANVAS'&&['width','height'].includes(record.attributeName))counters.canvasSizeMutations++;}});
  const observers=[];
  for(const type of ['longtask','long-animation-frame']){
   if(!PerformanceObserver.supportedEntryTypes.includes(type))continue;
   const observer=new PerformanceObserver(list=>{for(const entry of list.getEntries()){
    if(!started||entry.startTime<started)continue;
    if(type==='longtask')longTasks.push({start:entry.startTime,duration:entry.duration});
    else longFrames.push({start:entry.startTime,duration:entry.duration,blockingDuration:entry.blockingDuration,renderStart:entry.renderStart,styleAndLayoutStart:entry.styleAndLayoutStart,scripts:entry.scripts?.map(s=>({sourceURL:s.sourceURL,sourceFunctionName:s.sourceFunctionName,duration:s.duration,forcedStyleAndLayoutDuration:s.forcedStyleAndLayoutDuration}))});
   }});observer.observe({type,buffered:false});observers.push(observer);
  }
  window.scrollTo({top,behavior:'instant'});status.textContent='Warming shader / assets…';
  await new Promise(resolve=>setTimeout(resolve,3000));
  mutation.observe(hero,{subtree:true,attributes:true});window.addEventListener('scroll',scroll,{passive:true});
  started=performance.now();performance.mark('hero-benchmark-start');
  function finish(){
   ended=performance.now();performance.mark('hero-benchmark-end');performance.measure('hero-benchmark','hero-benchmark-start','hero-benchmark-end');
   window.removeEventListener('scroll',scroll);mutation.disconnect();observers.forEach(o=>{o.takeRecords().forEach(e=>{if(e.entryType==='longtask')longTasks.push({start:e.startTime,duration:e.duration});});o.disconnect();});
   const intervals=frames.map(f=>f.dt), median=quantile(intervals,.5), nominal=median<12?1000/120:1000/60;
   const byPhase=Object.fromEntries(phases.map(([name])=>{const a=frames.filter(f=>f.phase===name).map(f=>f.dt);return [name,{count:a.length,median:quantile(a,.5),p95:quantile(a,.95),over33:a.filter(x=>x>33.34).length}];}));
   const report={label:location.port==='3102'?'before':'after',run,userAgent:navigator.userAgent,viewport:{width:innerWidth,height:innerHeight,dpr:devicePixelRatio},supported:PerformanceObserver.supportedEntryTypes,hero:{top,distance,height:hero.offsetHeight},duration:ended-started,samples:frames.length,median,p95:quantile(intervals,.95),p99:quantile(intervals,.99),max:Math.max(...intervals),framesOver33:intervals.filter(x=>x>33.34).length,estimatedMissedVsync:intervals.reduce((n,x)=>n+Math.max(0,Math.round(x/nominal)-1),0),nominalInterval:nominal,longTaskCount:longTasks.length,longTaskMs:longTasks.reduce((n,e)=>n+e.duration,0),longAnimationFrameCount:longFrames.length,forcedStyleLayoutMs:longFrames.reduce((n,e)=>n+(e.scripts??[]).reduce((a,s)=>a+s.forcedStyleAndLayoutDuration,0),0),counters,byPhase,raw:{frames,longTasks,longFrames,events},limitations:['rAF intervals measure callbacks, not physically presented frames. Missed-vsync estimate is NOT an actual dropped-frame count.','Scripted scroll workload, not hardware-input latency.','LoAF only describes frames exceeding 50ms; rendering costs below threshold require DevTools trace.','GPU execution time is not directly measured.']};
   const output=JSON.stringify(report);const data=document.createElement('script');data.type='application/json';data.id='hero-benchmark-result';document.querySelector('#hero-benchmark-result')?.remove();data.textContent=output;document.body.append(data);
   summary.textContent=JSON.stringify({...report,raw:undefined,supported:undefined,userAgent:undefined,limitations:undefined},null,2);status.textContent='Benchmark complete';button.disabled=false;
   download.hidden=false;download.download=`hero-${report.label}-${innerWidth}-run${run}.json`;download.href=URL.createObjectURL(new Blob([output],{type:'application/json'}));
  }
  function tick(time){
   const [name,duration,from,to]=phases[phaseIndex];
   if(!phaseStart){phaseStart=time;events.push({phase:name,start:time});status.textContent=name;performance.mark(`hero-${name}`);}
   if(previous)frames.push({t:time,dt:time-previous,phase:name,y:scrollY});previous=time;
   const p=Math.min(1,(time-phaseStart)/duration);window.scrollTo({top:top+distance*(from+(to-from)*p),behavior:'instant'});
   if(p===1){phaseIndex++;phaseStart=0;if(phaseIndex===phases.length){finish();return;}}
   frame=requestAnimationFrame(tick);
  }
  frame=requestAnimationFrame(tick);
  window.addEventListener('pagehide',()=>{cancelAnimationFrame(frame);observers.forEach(o=>o.disconnect());mutation.disconnect();window.removeEventListener('scroll',scroll);},{once:true});
 };
})();
