import * as shaders from "./fluid-shaders";

// Giats' MIT-licensed fluid pipeline, adapted to WebGL2 without React Three Fiber.
// Copyright (c) 2025 Evangelos Giatsidis. See public/licenses/giats-MIT.txt.
const display = `#version 300 es
precision highp float;
in vec2 vUv;
uniform sampler2D uDensity;
out vec4 fragColor;
void main() {
  float density = length(texture(uDensity, vUv).rgb);
  // Same neutral, intensity-weighted density composite as the reference's post.frag.
  vec3 color = vec3(.941, .957, .945) * density * density * .0005;
  fragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
}`;

type Target = { texture: WebGLTexture; buffer: WebGLFramebuffer; size: number };
type Pair = { read: Target; write: Target };
type Uniform = number | number[] | Target;
type Program = { program: WebGLProgram; uniforms: Map<string, WebGLUniformLocation | null>; position: number };

export function createFluidRenderer(canvas: HTMLCanvasElement) {
  const gl = canvas.getContext("webgl2", { alpha:false, antialias:false, depth:false, stencil:false, powerPreference:"low-power" });
  if (!gl || !gl.getExtension("EXT_color_buffer_float")) return null;
  const programs: Program[] = [], targets: Target[] = [];
  const buffer = gl.createBuffer();
  const vertexArray = gl.createVertexArray();
  let disposed = false;
  function dispose() {
    if (disposed) return;
    disposed = true;
    for (const target of targets) { gl!.deleteTexture(target.texture); gl!.deleteFramebuffer(target.buffer); }
    for (const entry of programs) gl!.deleteProgram(entry.program);
    gl!.deleteBuffer(buffer); gl!.deleteVertexArray(vertexArray);
  }
  try {
    function compile(type: number, source: string) {
      const shader = gl!.createShader(type);
      if (!shader) throw new Error("Could not allocate fluid shader");
      gl!.shaderSource(shader,source); gl!.compileShader(shader);
      if (!gl!.getShaderParameter(shader,gl!.COMPILE_STATUS)) {
        const info = gl!.getShaderInfoLog(shader); gl!.deleteShader(shader);
        throw new Error(`Fluid shader compilation failed: ${info}`);
      }
      return shader;
    }
    function program(fragment: string): Program {
      const vertex = compile(gl!.VERTEX_SHADER,shaders.base);
      const pixel = compile(gl!.FRAGMENT_SHADER,fragment);
      const p = gl!.createProgram();
      if (!p) throw new Error("Could not allocate fluid program");
      gl!.attachShader(p,vertex); gl!.attachShader(p,pixel); gl!.linkProgram(p);
      gl!.deleteShader(vertex); gl!.deleteShader(pixel);
      if (!gl!.getProgramParameter(p,gl!.LINK_STATUS)) { gl!.deleteProgram(p); throw new Error("Fluid shader linking failed"); }
      const entry = { program:p, uniforms:new Map<string,WebGLUniformLocation|null>(), position:gl!.getAttribLocation(p,"position") };
      programs.push(entry); return entry;
    }
    gl.bindVertexArray(vertexArray); gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
    const passes = {
      splat:program(shaders.splat), curl:program(shaders.curl), vorticity:program(shaders.vorticity),
      divergence:program(shaders.divergence), clear:program(shaders.clear), pressure:program(shaders.pressure),
      gradient:program(shaders.gradientSubstract), advection:program(shaders.advection), display:program(display)
    };
    function target(size: number, linear = true): Target {
      const texture = gl!.createTexture(), framebuffer = gl!.createFramebuffer();
      if (!texture || !framebuffer) throw new Error("Could not allocate fluid target");
      gl!.bindTexture(gl!.TEXTURE_2D,texture);
      gl!.texParameteri(gl!.TEXTURE_2D,gl!.TEXTURE_MIN_FILTER,linear ? gl!.LINEAR : gl!.NEAREST);
      gl!.texParameteri(gl!.TEXTURE_2D,gl!.TEXTURE_MAG_FILTER,linear ? gl!.LINEAR : gl!.NEAREST);
      gl!.texParameteri(gl!.TEXTURE_2D,gl!.TEXTURE_WRAP_S,gl!.CLAMP_TO_EDGE);
      gl!.texParameteri(gl!.TEXTURE_2D,gl!.TEXTURE_WRAP_T,gl!.CLAMP_TO_EDGE);
      gl!.texImage2D(gl!.TEXTURE_2D,0,gl!.RGBA16F,size,size,0,gl!.RGBA,gl!.HALF_FLOAT,null);
      gl!.bindFramebuffer(gl!.FRAMEBUFFER,framebuffer);
      gl!.framebufferTexture2D(gl!.FRAMEBUFFER,gl!.COLOR_ATTACHMENT0,gl!.TEXTURE_2D,texture,0);
      const result = {texture,buffer:framebuffer,size}; targets.push(result);
      if (gl!.checkFramebufferStatus(gl!.FRAMEBUFFER) !== gl!.FRAMEBUFFER_COMPLETE) throw new Error("Fluid target unsupported");
      gl!.clearColor(0,0,0,1); gl!.clear(gl!.COLOR_BUFFER_BIT);
      return result;
    }
    const pair = (size: number, linear = true): Pair => ({read:target(size,linear),write:target(size,linear)});
    const velocity = pair(50), density = pair(256), pressure = pair(50,false);
    const curl = target(50,false), divergence = target(50,false);
    const swap = (p: Pair) => { [p.read,p.write] = [p.write,p.read]; };
    function pass(p: Program, output: Target | null, values: Record<string,Uniform>) {
      gl!.useProgram(p.program); gl!.bindVertexArray(vertexArray);
      gl!.bindBuffer(gl!.ARRAY_BUFFER,buffer); gl!.enableVertexAttribArray(p.position);
      gl!.vertexAttribPointer(p.position,2,gl!.FLOAT,false,0,0);
      gl!.bindFramebuffer(gl!.FRAMEBUFFER,output?.buffer ?? null);
      gl!.viewport(0,0,output?.size ?? canvas.width,output?.size ?? canvas.height);
      let unit = 0;
      for (const [key,value] of Object.entries(values)) {
        if (!p.uniforms.has(key)) p.uniforms.set(key,gl!.getUniformLocation(p.program,key));
        const location = p.uniforms.get(key)!;
        if (typeof value === "number") gl!.uniform1f(location,value);
        else if (Array.isArray(value)) {
          if (value.length === 2) gl!.uniform2f(location,value[0],value[1]);
          else gl!.uniform3f(location,value[0],value[1],value[2]);
        } else {
          gl!.activeTexture(gl!.TEXTURE0+unit); gl!.bindTexture(gl!.TEXTURE_2D,value.texture);
          gl!.uniform1i(location,unit++);
        }
      }
      gl!.drawArrays(gl!.TRIANGLES,0,6);
    }
    let viewportWidth = 1, viewportHeight = 1;
    const texel = () => [1/(50*viewportWidth/(viewportHeight+400)),1/50];
    function resize() {
      viewportWidth = innerWidth; viewportHeight = innerHeight;
      // Matches the reference's capped half-resolution display; simulation stays 50/256.
      canvas.width = Math.round(viewportWidth*.5); canvas.height = Math.round(viewportHeight*.5);
      clear();
    }
    function clear() {
      for (const t of targets) { gl!.bindFramebuffer(gl!.FRAMEBUFFER,t.buffer); gl!.clearColor(0,0,0,1); gl!.clear(gl!.COLOR_BUFFER_BIT); }
      gl!.bindFramebuffer(gl!.FRAMEBUFFER,null); gl!.clearColor(0,0,0,1); gl!.clear(gl!.COLOR_BUFFER_BIT);
    }
    function splat(x: number,y: number,dx: number,dy: number) {
      const values = {uPointer:[x,y],uColor:[dx,dy,10],uRadius:.0014,aspectRatio:viewportWidth/viewportHeight};
      pass(passes.splat,velocity.write,{...values,uTarget:velocity.read}); swap(velocity);
      pass(passes.splat,density.write,{...values,uTarget:density.read}); swap(density);
    }
    function render(dt: number) {
      const texelSize = texel();
      pass(passes.curl,curl,{uVelocity:velocity.read,texelSize});
      pass(passes.vorticity,velocity.write,{uVelocity:velocity.read,uCurl:curl,uCurlValue:1,dt,texelSize}); swap(velocity);
      pass(passes.divergence,divergence,{uVelocity:velocity.read,texelSize});
      pass(passes.clear,pressure.write,{uTexture:pressure.read,uClearValue:0}); swap(pressure);
      for (let i = 0; i < 3; i++) { pass(passes.pressure,pressure.write,{uPressure:pressure.read,uDivergence:divergence,texelSize}); swap(pressure); }
      pass(passes.gradient,velocity.write,{uPressure:pressure.read,uVelocity:velocity.read,texelSize}); swap(velocity);
      const factor = dt/.016;
      pass(passes.advection,velocity.write,{uVelocity:velocity.read,uSource:velocity.read,dt,uDissipation:Math.pow(.93,factor),texelSize}); swap(velocity);
      pass(passes.advection,density.write,{uVelocity:velocity.read,uSource:density.read,dt,uDissipation:Math.pow(.965,factor),texelSize}); swap(density);
      pass(passes.display,null,{uDensity:density.read});
    }
    resize();
    return {splat,render,resize,clear,dispose};
  } catch (error) {
    dispose();
    console.warn("Fluid cursor unavailable. Standard pointer remains active.",error);
    return null;
  }
}
