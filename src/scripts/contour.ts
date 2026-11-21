// Topographic contour shader. One full-screen triangle, everything happens in the fragment shader.

const vert = `#version 300 es
in vec2 p;
void main() { gl_Position = vec4(p, 0.0, 1.0); }`;

const frag = `#version 300 es
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;
uniform float uHover;
uniform float uDensity;
uniform vec3 uBg;
uniform vec3 uLine;
uniform vec3 uAccent;
out vec4 outColor;

// 3D simplex noise, Ashima Arts / Stefan Gustavson (MIT)
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}

float fbm(vec3 p) {
  float s = 0.0, a = 0.55;
  for (int i = 0; i < 4; i++) { s += a * snoise(p); p = p * 2.03 + vec3(1.7, 9.2, 0.0); a *= 0.5; }
  return s;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes.y;
  vec2 m = uMouse / uRes.y;
  float d = distance(uv, m);

  // Terrain height: slow drifting noise, plus a hill under the cursor
  float hill = uHover * 0.42 * exp(-d * d * 7.0);
  float h = fbm(vec3(uv * 1.15, uTime * 0.035)) + hill;

  float v = h * uDensity;
  float f = abs(fract(v) - 0.5);
  float w = fwidth(v);
  float line = 1.0 - smoothstep(0.0, w * 1.15, 0.5 - f);
  float major = mod(floor(v + 0.5), 5.0) < 0.5 ? 1.0 : 0.0;
  float bold = 1.0 - smoothstep(0.0, w * 2.0, 0.5 - f);
  float a = mix(line * 0.32, bold * 0.62, major);

  float glow = smoothstep(0.5, 0.0, d) * uHover;
  vec3 col = mix(uLine, uAccent, glow);
  a = mix(a, min(1.0, a * 1.8), glow);

  outColor = vec4(mix(uBg, col, a), 1.0);
}`;

const tones = {
  light: { bg: [0.863, 0.847, 0.82], line: [0.078, 0.078, 0.078], accent: [0.259, 0.745, 0.357] },
  dark: { bg: [0.067, 0.075, 0.067], line: [0.92, 0.91, 0.89], accent: [0.259, 0.745, 0.357] },
} as const;

export function mountContour(host: HTMLElement) {
  const canvas = host.querySelector('canvas');
  if (!canvas) return;
  const gl = canvas.getContext('webgl2', { antialias: false, premultipliedAlpha: false });
  if (!gl) return;

  const compile = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) console.warn(gl.getShaderInfoLog(s));
    return s;
  };
  const prog = gl.createProgram()!;
  gl.attachShader(prog, compile(gl.VERTEX_SHADER, vert));
  gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, frag));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'p');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  const u = (n: string) => gl.getUniformLocation(prog, n);
  const uRes = u('uRes'), uTime = u('uTime'), uMouse = u('uMouse'), uHover = u('uHover');
  const tone = tones[(host.dataset.tone as 'light' | 'dark') ?? 'light'] ?? tones.light;
  gl.uniform3fv(u('uBg'), tone.bg);
  gl.uniform3fv(u('uLine'), tone.line);
  gl.uniform3fv(u('uAccent'), tone.accent);
  gl.uniform1f(u('uDensity'), Number(host.dataset.density ?? 9));

  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  const resize = () => {
    const r = host.getBoundingClientRect();
    canvas.width = Math.max(1, Math.round(r.width * dpr));
    canvas.height = Math.max(1, Math.round(r.height * dpr));
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(uRes, canvas.width, canvas.height);
  };
  resize();
  new ResizeObserver(resize).observe(host);

  // Pointer, smoothed so the hill glides rather than jumps
  const target = { x: canvas.width * 0.7, y: canvas.height * 0.45, h: 0 };
  const cur = { ...target };
  const area = (host.closest('[data-contour-area]') as HTMLElement) ?? host;
  area.addEventListener('pointermove', (e) => {
    const r = host.getBoundingClientRect();
    target.x = (e.clientX - r.left) * dpr;
    target.y = (r.bottom - e.clientY) * dpr;
    target.h = 1;
  });
  area.addEventListener('pointerleave', () => (target.h = 0));

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const start = performance.now() - Math.random() * 60000;
  let visible = true;
  let raf = 0;

  const draw = (now: number) => {
    cur.x += (target.x - cur.x) * 0.08;
    cur.y += (target.y - cur.y) * 0.08;
    cur.h += (target.h - cur.h) * 0.05;
    gl.uniform1f(uTime, (now - start) / 1000);
    gl.uniform2f(uMouse, cur.x, cur.y);
    gl.uniform1f(uHover, cur.h);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  const loop = (now: number) => {
    draw(now);
    if (visible && !reduce) raf = requestAnimationFrame(loop);
  };

  new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    cancelAnimationFrame(raf);
    if (visible && !reduce) raf = requestAnimationFrame(loop);
  }).observe(host);

  draw(performance.now());
  host.classList.add('is-live');
}
