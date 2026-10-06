import { useEffect, useRef } from 'react'

/**
 * WebGL domain-warped fractal noise background.
 * theme: 'green' (search page) | 'purple' (my list) | 'blue' (any other use)
 */
export default function WebGLBackground({ active = true, theme = 'green' }) {
  const canvasRef = useRef(null)
  const stateRef  = useRef({ raf: 0, gl: null, loc: null, t0: 0, ready: false, failed: false })

  // Color palette per theme — vec3 values injected into shader
  const palette = {
    green:  { a: 'vec3(.004,.05,.012)', b: 'vec3(.04,.27,.05)',  hi: 'vec3(.10,.55,.10)', ridge: 'vec3(.25,.95,.45)', edge: 'vec3(.0,.85,.75)'  },
    purple: { a: 'vec3(.01,.004,.04)',  b: 'vec3(.12,.04,.28)',  hi: 'vec3(.35,.10,.55)', ridge: 'vec3(.75,.45,.95)', edge: 'vec3(.55,.0,.85)'  },
    blue:   { a: 'vec3(.004,.01,.05)',  b: 'vec3(.04,.10,.30)',  hi: 'vec3(.10,.30,.55)', ridge: 'vec3(.45,.75,.95)', edge: 'vec3(.0,.65,.95)'  },
  }
  const p = palette[theme] || palette.green

  const fallback = {
    green:  'radial-gradient(55% 55% at 25% 30%, #1f7a1c, transparent 70%), radial-gradient(50% 60% at 80% 60%, #0c5a2e, transparent 70%), #06240a',
    purple: 'radial-gradient(55% 55% at 25% 30%, #3a1a6a, transparent 70%), radial-gradient(50% 60% at 80% 60%, #1a0a3a, transparent 70%), #0a0612',
    blue:   'radial-gradient(55% 55% at 25% 30%, #1a3a6a, transparent 70%), radial-gradient(50% 60% at 80% 60%, #0a1a4a, transparent 70%), #060812',
  }[theme] || ''

  useEffect(() => {
    const cv = canvasRef.current
    if (!cv) return
    const s = stateRef.current

    const VS = `attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`
    const FS = `
precision mediump float;
uniform vec2 r;
uniform float t;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){
  vec2 i=floor(p),f=fract(p);
  f=f*f*f*(f*(f*6.-15.)+10.);
  return mix(mix(h(i),h(i+vec2(1.,0.)),f.x),mix(h(i+vec2(0.,1.)),h(i+vec2(1.,1.)),f.x),f.y);
}
float fbm(vec2 p){
  float v=0.,a=.5;
  for(int i=0;i<3;i++){v+=a*n(p);p=p*2.03+vec2(3.1,1.7);a*=.5;}
  return v;
}
float field(vec2 p,float tt){
  vec2 q=vec2(fbm(p+vec2(0.,tt)),fbm(p+vec2(5.2,1.3)-tt));
  vec2 w=vec2(fbm(p+2.4*q+vec2(1.7,9.2)+tt*.8),fbm(p+2.4*q+vec2(8.3,2.8)-tt*.7));
  return fbm(p+2.6*w);
}
void main(){
  vec2 uv=gl_FragCoord.xy/r.y;
  vec2 p=uv*1.5;
  float tt=t*.045;
  float e=.012;
  float f=field(p,tt);
  vec2 g=vec2(field(p+vec2(e,0.),tt)-f,field(p+vec2(0.,e),tt)-f)/e;
  float slope=length(g);
  float light=clamp(dot(normalize(vec3(-g*.35,1.)),normalize(vec3(-.5,.6,.65))),0.,1.);
  float ridge=1.-abs(2.*f-1.);
  vec3 c=mix(${p.a},${p.b},smoothstep(.25,.75,f));
  c+=${p.hi}*pow(light,4.)*.45;
  c+=${p.ridge}*pow(ridge,10.)*.3;
  c+=${p.edge}*smoothstep(.6,1.6,slope)*pow(ridge,3.)*.22;
  vec2 d=gl_FragCoord.xy/r-.5;
  c*=.55+.45*smoothstep(1.15,.1,length(d*vec2(1.1,1.)));
  gl_FragColor=vec4(c,1.);
}`

    function build() {
      const gl = cv.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power' })
      if (!gl) return false
      const sh = (type, src) => {
        const o = gl.createShader(type)
        gl.shaderSource(o, src); gl.compileShader(o)
        return gl.getShaderParameter(o, gl.COMPILE_STATUS) ? o : null
      }
      const vs = sh(gl.VERTEX_SHADER, VS)
      const fs = sh(gl.FRAGMENT_SHADER, FS)
      if (!vs || !fs) return false
      const pr = gl.createProgram()
      gl.attachShader(pr, vs); gl.attachShader(pr, fs); gl.linkProgram(pr)
      if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) return false
      gl.useProgram(pr)
      gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 3,-1, -1,3]), gl.STATIC_DRAW)
      const a = gl.getAttribLocation(pr, 'p')
      gl.enableVertexAttribArray(a); gl.vertexAttribPointer(a, 2, gl.FLOAT, false, 0, 0)
      s.gl  = gl
      s.loc = { r: gl.getUniformLocation(pr, 'r'), t: gl.getUniformLocation(pr, 't') }
      return true
    }

    function resize() {
      const k = 0.5
      cv.width  = Math.max(2, Math.floor(window.innerWidth  * k))
      cv.height = Math.max(2, Math.floor(window.innerHeight * k))
      s.gl.viewport(0, 0, cv.width, cv.height)
    }

    function draw() {
      s.gl.uniform2f(s.loc.r, cv.width, cv.height)
      s.gl.uniform1f(s.loc.t, (performance.now() - s.t0) / 1000)
      s.gl.drawArrays(s.gl.TRIANGLES, 0, 3)
    }

    function loop() { draw(); s.raf = requestAnimationFrame(loop) }

    function start() {
      if (s.failed) return
      if (!s.ready) {
        s.ready = build()
        if (!s.ready) { s.failed = true; return }
        s.t0 = performance.now()
      }
      resize()
      cancelAnimationFrame(s.raf)
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) draw()
      else loop()
    }

    const onResize = () => { if (s.ready) { resize(); draw() } }
    window.addEventListener('resize', onResize)
    if (active) start()
    else { cancelAnimationFrame(s.raf); s.raf = 0 }

    return () => {
      cancelAnimationFrame(s.raf)
      window.removeEventListener('resize', onResize)
    }
  }, [active, theme])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed', inset: 0,
        width: '100%', height: '100%',
        zIndex: -1,
        opacity: active ? 1 : 0,
        visibility: active ? 'visible' : 'hidden',
        transition: 'opacity .6s, visibility .6s',
        background: fallback,
      }}
    />
  )
}
