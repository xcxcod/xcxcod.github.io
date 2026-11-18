# Hero motion investigation and proof

## Scope
Hero only. Selected Work, About (including the new portrait), education, constellation and contact keep their current choreography. This is a staged ownership boundary, not a simultaneous wholesale GSAP migration. No deployment.

## Research: observed vs inferred
- Inspected Apple's live iPhone Air page in a browser. DOM contains a hero MP4 (`welcome-video`, currentSrc under apple.com/105/media/.../anim/hero/large.mp4), lazy media galleries, sticky UI and poster images. In this environment several videos have readyState 0 / “Unable to play media”. That prevents a reliable frame-by-frame visual comparison of those videos. The inspected document had zero canvases at the sampled state. **Do not generalize a third-party Canvas tutorial into a claim about Apple's exact implementation.**
- GSAP Vault describes a third-party recreation: numbered frames, Canvas, decoded/staged loading and scroll-to-frame mapping. Its claim about Apple's technique was not independently established here. It is architectural inspiration, not evidence of Apple's internal implementation.
- GSAP ScrollTrigger supports cached scroll ranges, direct `scrub: true`, refresh, timelines, scoped cleanup and responsive media contexts. Numeric scrub deliberately introduces catch-up time; avoid it in this proof.
- Google recommends transform/opacity animation and diagnosing layout, paint and compositing separately. A library swap cannot cure expensive rendering on its own.
- npm's Lenis page returned 403. Reviewed the official Lenis repository instead: lerp/duration-based smoothing, a continuous RAF and ScrollTrigger ticker integration. Not selected: native scrolling is already available, and extra interpolation would obscure the lag diagnosis.
- Drei explicitly documents an extra render pass for MeshTransmissionMaterial and recommends lowering samples/resolution. Fiber documents on-demand rendering; installed Fiber code confirms Canvas defaults to scroll-sensitive measurement with a 50ms debounce.

Sources:
- https://www.apple.com/iphone-air/
- https://gsap.com/docs/v3/Plugins/ScrollTrigger/
- https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/
- https://web.dev/articles/animations-guide
- https://web.dev/articles/rendering-performance/
- https://gsapvault.com/blog/scroll-image-sequence-tutorial
- https://github.com/darkroomengineering/lenis
- https://r3f.docs.pmnd.rs/advanced/scaling-performance
- https://drei.docs.pmnd.rs/shaders/mesh-transmission-material
- https://developer.chrome.com/docs/web-platform/long-animation-frames

## Existing implementation findings
| Area | Evidence | Interpretation |
|---|---|---|
| Coordinator | Every update seeks all tracks and writes progress attributes, including offscreen sections; dispatches `portfolio:scroll` synchronously afterwards | Unnecessary per-scroll work |
| Forced layout | Hero subscriber calls getBoundingClientRect after animation writes. LoAF script attribution maps forced style/layout to the minified coordinator's `b` function; local bundled source confirms `b` is the update loop | Measured synchronous rendering cost, not merely suspected |
| Canvas resize | Baseline warm desktop runs observe 48–68 bitmap width/height attribute mutations in a ~13–14s workload | Unstable render surface during CSS-transformed hero; installed Fiber defaults also observe scroll bounds |
| Rendering | Visible hero uses `frameloop="always"`; transmission material adds scene pass; sphere 96×64; 512px buffer; DPR up to 1.5 | Live rendering is continuous even while no input changes |
| Timing | Direct DOM scrub is combined with delta damping coefficient 5 for the 3D pose | 3D has a ~0.6s 95%-settling time at normal frame intervals, while text does not; mathematical time constant, not measured hardware input latency |
| Re-render risk | Parent coordinator effect depends on React children identity; Canvas measurement changes can reconfigure renderer through React | No claim of measured React commit counts: production React profiler data is unavailable |
| Visual pacing | 195svh hero plus header; early headline disappears before final text; whole render surface moves/rescales | Long holding space and material/perspective changes compete with reading |
| Other graphics | Fluid cursor uses a separate GPU loop while pointer motion is active, then sleeps | Keep unchanged for this scoped proof; benchmark does not disable it selectively |

## Architecture evaluation
| Choice | Strength | Cost / limitation | Decision |
|---|---|---|---|
| Custom paused WAAPI coordinator | No extra library; direct seek already possible | Manual refresh/cleanup/measurement ownership; current write→read chain forces layout | Retain below hero; remove hero ownership |
| GSAP ScrollTrigger | Named phases, cached range, direct scrub, refresh and scoped media teardown | Added JS; not automatically faster; ticker still runs while document is active | Use for one hero with `scrub: true`, native CSS sticky and no smooth-scroll replacement |
| Lenis | Unified smooth wheel/touch integration where desired | Interpolation/ticker adds another clock; masks direct response | Do not install |
| A. Live R3F | Real pointer response, responsive geometry, no frame payload | Shader/GPU cost; must stabilize dimensions and stop idle drawing | Desktop on demand; lower-cost immutable geometry/material setup |
| B. Pre-rendered image sequence | Predictable art direction; frame-accurate reverse; avoids live 3D shading | Need an authored frame set and regeneration pipeline; decoding/network/memory cost; no arbitrary lens response | Not chosen without approved sequence assets. Example: 90 decoded 1440×800 RGBA frames require ~396MiB before other resources, regardless of compressed download size |
| C. Scroll-scrubbed video | Efficient compressed delivery and hardware decoding | Keyframe seek latency; reverse scrubbing; codec/browser differences; no spatial pointer response | Not chosen for interactive lens. Could suit a future non-interactive film with encoded/benchmarked short GOPs |

## Proposed hero sequence
0–30%: headline contracts and lifts while the visual expands into its space.
8–45%: supporting visual copy yields to the work itself.
30–72%: bridge typography enters from static overflow masks, with a clear visual focus.
72–100%: composition holds briefly, then normal scrolling releases into Selected Work.
Pin only on wide, adequately tall screens. Shorten the desktop chapter from 195svh to 165svh. Mobile uses a normal-flow high-quality still, no heavy WebGL or pin. Reduced motion / pause exposes a static readable composition. Scroll pose is exact; only pointer easing can briefly settle. No hero bitmap resizing caused by scroll, no frame React state, no scroll-time DOM reads from the hero subscriber.

## Measurement protocol and limits
Frozen pre-change production output at localhost:3102. Identical opt-in local-only harness injects into output COPIES, not the production app. Three-second warm-up, then 5s forward, 1s hold, 3s reverse, 1s rapid forward, 1s rapid reverse, 2s hold. Scroll range normalized to each hero's actual distance. Uses requestAnimationFrame timestamps, PerformanceObserver longtask and long-animation-frame entries with forced-layout attribution; MutationObserver counts canvas bitmap dimension changes.

Native DevTools automation failed because OS computer-use permissions are not granted. Therefore no Chrome DevTools CPU flame-chart export, direct GPU execution timings, physically presented frame/drop counts or React commit counts are claimed. Raw browser-API recordings are saved. rAF p95 is a frame-callback consistency metric, not proof of 60 FPS. Scripted scroll latency is not hardware input latency. Long Animation Frames expose attribution only for sufficiently long frames. Browser extensions, hardware workload and test instrumentation add noise. Narrow viewport is desktop hardware at mobile dimensions, not a physical phone.

Baseline run 2 was interrupted by the failed native-app permission attempt (85.8s elapsed for a ~13s test); exclude from comparisons. Retain its raw file for transparency. Desktop browser zoom makes requested physical viewport 1440×1000 correspond to actual CSS viewport 1600×1111, DPR ~0.9; compare actual viewport and DPR, not assumed values.

## Reproducing the browser recording
1. `npm run build` (production/static export).
2. `node scripts/prepare-hero-benchmark.mjs out` creates a disposable output copy with the opt-in QA UI. It does **not** alter `out` or ship the harness to visitors.
3. Start the printed loopback server command. Open in Chromium, set and verify the actual CSS viewport and DPR, wait for initial media, then Run hero benchmark. Keep this tab visible and avoid builds during recording.
4. Download raw JSON. Repeat warm runs, recording any interruptions. Use a pre-change export to reproduce baseline. The user must preserve that export separately; the repository does not duplicate the entire prior site.
5. To obtain a full Chrome trace manually, open DevTools Performance, record the same workload and save the trace. The automated browser here did not have permission to operate native DevTools.

Production adds one dependency (GSAP); no Lenis. GSAP/ScrollTrigger are dynamically imported only for the desktop motion path. Final homepage first-load JS stays approximately 243kB in Next's build summary, rather than the 288kB initial eager-GSAP candidate. This is a bundle estimate, not a network or LCP benchmark.

## Results — final proof
Chromium 157 on the same desktop. Matched actual viewport **1600×1111 CSS px**, DPR **~0.9**. Three valid desktop runs each. Values below are medians across runs; no outlier trimming inside runs.

| Metric | Before | Final after | Interpretation |
|---|---:|---:|---|
| rAF callback interval p95 | 53.4ms | 14.1ms | 73.6% lower; not a physical-frame-rate guarantee |
| rAF callback interval p99 | 172.6ms | 26.8ms | More consistent tail pacing |
| Callback intervals >33.34ms | 54 | 4 | 92.6% fewer in this workload |
| Long tasks ≥50ms | 28 | 2 | Long tasks still occur in some runs |
| Time inside long tasks | 3133ms | 112ms | Main-thread stalls materially reduced |
| Canvas width/height mutations | 56 | 0 | Scroll no longer resizes the hero bitmap |
| Forced style/layout attributed within LoAF entries | 252.4ms | 1.3ms | Only long-frame attribution; **not** total layout time. Includes the benchmark's `scrollTo` cost |

Final after runs p95: **26.7 / 14.0 / 14.1ms**. The first final recording still has stalls (maximum callback interval 146.7ms); the other two maxima are 54.4 / 53.4ms. The result is an improvement, not a claim that all jank has vanished. Early eager-GSAP candidate runs also showed improvements, but the table uses the final lazy-loaded bundle recordings. Global pause and manual pointer checks were performed separately from timed captures. A later pause-preservation fix does not change the timed running path.

Narrow viewport **433×937 CSS px**, same desktop hardware/DPR, two runs each:
- Before p95 **14.4 / 14.2ms**; after **14.2 / 14.3ms** — essentially unchanged.
- Intervals >33.34ms: **15 / 11 → 5 / 5**.
- Before long tasks **7 / 2**; after **3 / 3** — variable, do not overstate the two-run result.
- After has **no hero WebGL canvas**, a normal-flow stage, and zero hero attribute churn from scroll. Physical touch hardware, thermal behaviour and mobile GPU throughput were not measured.

Raw records: [traces/](traces/). Summary computed from those files: [summary.json](summary.json). Baseline run 2 is retained as `before-desktop-interrupted-excluded.json` with the reason documented above. The stale result initially read after a viewport switch was detected by checking its recorded viewport and excluded before mobile comparisons. Unmatched viewport and intermediate candidate recordings remain in the local temporary investigation folder, not the comparison set.

### Important trace-field caveat
The harness includes a legacy `estimatedMissedVsync` heuristic assuming 60/120Hz. The observed callbacks are around 13.3ms, so that assumption is inappropriate here. **Do not use that field or call it dropped frames.** The report uses explicit >33.34ms intervals and rAF percentiles instead. No compositor present/drop trace or GPU duration was obtainable through the available browser API. A full native DevTools trace remains the next step for attributing the remaining occasional stalls.

### Engineering changes responsible for the proof
- Removed hero tracks/entrance from the lower-page WAAPI coordinator; only one owner writes each hero transform.
- Removed the hero's synchronous post-write DOM measurement subscriber.
- Cached timeline geometry through ScrollTrigger refresh; direct scrub, no numeric catch-up, no Lenis.
- Replaced changing hero border radius / clip-path animations with transforms, opacity and static overflow masks.
- Kept the bitmap independent of CSS transforms using `resize={{scroll:false,offsetSize:true}}`.
- Switched visible hero from continuous rendering to demand rendering. Scroll pose is direct; short pointer damping invalidates only until settled. Visibility and pause gate invalidation.
- Halved transmission samples (6→3), reduced refraction buffer (512→256), sphere segments (96×64→48×32), environment resolution (128→64), DPR cap (up to 1.5→1), and removed time-varying shader distortion. These are settings reductions, **not separately isolated GPU timing measurements**.
- Shortened pin range at the measured desktop viewport from **1056px to ~722px** (195svh→165svh chapter), with three coordinated phases and no long empty pause.
- Kept identity, native navigation, About portrait, project content and all backend workflows intact. No further sections were redesigned in this proof.

## Verification
Typecheck, zero-warning lint, 46 tests across 13 files and production/static export succeed. Browser verification includes forward/reverse scroll recordings, pause→static flow→resume, mobile/desktop resize, mobile no-WebGL path and no horizontal overflow. OS reduced-motion branch is covered by automated tests; the OS setting was not changed during these browser checks. Final manual visual checks and screenshot accompany the delivered preview.

Final essential-check correction: the bridge headline is now inside the transformed visual wrapper, preventing it from slipping onto the light background or overlapping controls. This DOM containment correction was typechecked and rebuilt; no additional benchmark runs were performed after the user requested closure.
