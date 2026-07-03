/**
 * KinetixBI — Neural Network Canvas (Deep Tech Overload v2)
 * ─ 200 particles  ─ 8 rotating 3D shapes  ─ scroll parallax  ─ pulsing nodes
 */

(function () {
  const canvas = document.createElement('canvas');
  canvas.id = 'bg-canvas';
  Object.assign(canvas.style, {
    position: 'fixed', top: '0', left: '0',
    width: '100vw', height: '100vh',
    zIndex: '-2', pointerEvents: 'none'
  });
  document.body.prepend(canvas);

  const ctx = canvas.getContext('2d');
  let W, H, particles = [], shapes = [];
  let scrollY = 0;

  /* ── Resize ── */
  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', () => { resize(); initShapes(); });
  resize();

  /* ── Scroll Parallax ── */
  window.addEventListener('scroll', () => { scrollY = window.scrollY; }, { passive: true });

  /* ── Color Palette ── */
  const COLORS = [
    { r: 6,   g: 182, b: 212 },   // cyan
    { r: 99,  g: 102, b: 241 },   // indigo
    { r: 217, g: 70,  b: 239 },   // magenta
    { r: 168, g: 85,  b: 247 },   // purple
  ];

  function randColor() { return COLORS[Math.floor(Math.random() * COLORS.length)]; }
  function cssRgba(c, a) { return `rgba(${c.r},${c.g},${c.b},${a})`; }

  /* ══════════════════════ PARTICLE ══════════════════════ */
  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x    = Math.random() * W;
      this.y    = Math.random() * H;
      this.baseY = this.y;
      this.vx   = (Math.random() - 0.5) * 0.55;
      this.vy   = (Math.random() - 0.5) * 0.55;
      this.r    = Math.random() * 2.2 + 0.6;
      this.color = randColor();
      this.phase = Math.random() * Math.PI * 2;  // for pulse
    }
    update(t) {
      this.x += this.vx;
      this.y += this.vy;
      /* Scroll parallax: slower layer moves less */
      const parallax = (this.r / 3) * scrollY * 0.04;
      const py = this.y - parallax;
      this._drawY = py;
      if (this.x < 0 || this.x > W) this.vx *= -1;
      if (this.y < 0 || this.y > H) this.vy *= -1;
    }
    draw(t) {
      const pulse = 1 + 0.35 * Math.sin(t * 0.002 + this.phase);
      const r = this.r * pulse;
      ctx.beginPath();
      ctx.arc(this.x, this._drawY ?? this.y, r, 0, Math.PI * 2);
      ctx.fillStyle = cssRgba(this.color, 0.75);
      ctx.shadowBlur  = 10 * pulse;
      ctx.shadowColor = cssRgba(this.color, 0.9);
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  /* ══════════════════════ 3D SHAPE ══════════════════════ */
  /* Supported types: 'cube', 'octa', 'cross' */
  class Shape3D {
    constructor(x, y, size, color, type = 'cube') {
      this.ox = x; this.oy = y;
      this.x  = x; this.y  = y;
      this.size  = size;
      this.color = color;
      this.type  = type;
      this.rx  = Math.random() * Math.PI;
      this.ry  = Math.random() * Math.PI;
      this.rz  = Math.random() * Math.PI;
      this.vrx = (Math.random() - 0.5) * 0.007;
      this.vry = (Math.random() - 0.5) * 0.007;
      this.vrz = (Math.random() - 0.5) * 0.007;
      this.floatPhase = Math.random() * Math.PI * 2;

      /* Define vertices & edges by type */
      if (type === 'cube') {
        this.verts = [
          [-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],
          [-1,-1, 1],[1,-1, 1],[1,1, 1],[-1,1, 1]
        ];
        this.edges = [
          [0,1],[1,2],[2,3],[3,0],
          [4,5],[5,6],[6,7],[7,4],
          [0,4],[1,5],[2,6],[3,7]
        ];
      } else if (type === 'octa') {
        this.verts = [
          [0,1,0],[0,-1,0],
          [1,0,0],[-1,0,0],
          [0,0,1],[0,0,-1]
        ];
        this.edges = [
          [0,2],[0,3],[0,4],[0,5],
          [1,2],[1,3],[1,4],[1,5],
          [2,4],[4,3],[3,5],[5,2]
        ];
      } else { /* cross / diamond */
        this.verts = [
          [0,1.2,0],[0,-1.2,0],
          [1.2,0,0],[-1.2,0,0],
          [0,0,1.2],[0,0,-1.2],
          [0.7,0.7,0],[-0.7,0.7,0],
          [0.7,-0.7,0],[-0.7,-0.7,0]
        ];
        this.edges = [
          [0,6],[0,7],[1,8],[1,9],
          [2,6],[2,8],[3,7],[3,9],
          [0,4],[1,4],[0,5],[1,5],
          [6,7],[8,9],[4,5]
        ];
      }
    }

    rotate(v) {
      let [x, y, z] = v.map(c => c * this.size);
      /* X rotation */
      let y1 = y * Math.cos(this.rx) - z * Math.sin(this.rx);
      let z1 = y * Math.sin(this.rx) + z * Math.cos(this.rx);
      /* Y rotation */
      let x2 = x * Math.cos(this.ry) + z1 * Math.sin(this.ry);
      let z2 = -x * Math.sin(this.ry) + z1 * Math.cos(this.ry);
      /* Z rotation */
      let x3 = x2 * Math.cos(this.rz) - y1 * Math.sin(this.rz);
      let y3 = x2 * Math.sin(this.rz) + y1 * Math.cos(this.rz);
      return { x: this.x + x3, y: this.y + y3 };
    }

    update(t) {
      this.rx += this.vrx;
      this.ry += this.vry;
      this.rz += this.vrz;
      /* Float */
      this.x = this.ox + Math.sin(t * 0.0007 + this.floatPhase) * 18;
      this.y = this.oy + Math.cos(t * 0.0009 - this.floatPhase) * 18;
      /* Scroll parallax */
      this.y = this.oy + Math.cos(t * 0.0009 - this.floatPhase) * 18 - scrollY * 0.06;
    }

    draw() {
      const pts = this.verts.map(v => this.rotate(v));
      ctx.shadowBlur  = 18;
      ctx.shadowColor = cssRgba(this.color, 0.6);
      ctx.strokeStyle = cssRgba(this.color, 0.22);
      ctx.lineWidth   = 1.1;
      ctx.beginPath();
      for (const [a, b] of this.edges) {
        ctx.moveTo(pts[a].x, pts[a].y);
        ctx.lineTo(pts[b].x, pts[b].y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;
    }
  }

  /* ── Max connection distance for particles ── */
  const MAX_DIST = 130;

  /* ── Init particles ── */
  function initParticles() {
    particles = [];
    for (let i = 0; i < 200; i++) particles.push(new Particle());
  }

  /* ── Init 3D shapes (8 shapes spread across viewport) ── */
  function initShapes() {
    const types = ['cube','octa','cross'];
    const defs = [
      { x: 0.08, y: 0.18, s: 42, ci: 0, t: 'cube'  },
      { x: 0.92, y: 0.22, s: 52, ci: 1, t: 'octa'  },
      { x: 0.18, y: 0.72, s: 46, ci: 2, t: 'cross' },
      { x: 0.82, y: 0.68, s: 38, ci: 3, t: 'cube'  },
      { x: 0.50, y: 0.12, s: 35, ci: 0, t: 'octa'  },
      { x: 0.15, y: 0.45, s: 30, ci: 1, t: 'cross' },
      { x: 0.85, y: 0.50, s: 44, ci: 2, t: 'cube'  },
      { x: 0.50, y: 0.82, s: 40, ci: 3, t: 'octa'  },
    ];
    shapes = defs.map(d => new Shape3D(d.x * W, d.y * H, d.s, COLORS[d.ci], d.t));
  }

  initParticles();
  initShapes();

  /* ── Render loop ── */
  function animate(t) {
    ctx.clearRect(0, 0, W, H);

    /* 3D shapes (back layer) */
    shapes.forEach(s => { s.update(t); s.draw(); });

    /* Particles */
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.update(t);
      p.draw(t);

      /* Draw connections */
      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dx = p.x - q.x;
        const dy = (p._drawY ?? p.y) - (q._drawY ?? q.y);
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < MAX_DIST) {
          const alpha = (1 - d / MAX_DIST) * 0.20;
          const grad  = ctx.createLinearGradient(p.x, p._drawY ?? p.y, q.x, q._drawY ?? q.y);
          grad.addColorStop(0, cssRgba(p.color, alpha));
          grad.addColorStop(1, cssRgba(q.color, alpha));
          ctx.beginPath();
          ctx.moveTo(p.x, p._drawY ?? p.y);
          ctx.lineTo(q.x, q._drawY ?? q.y);
          ctx.strokeStyle = grad;
          ctx.lineWidth   = 0.75;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
})();
