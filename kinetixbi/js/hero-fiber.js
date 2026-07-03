(function() {
  const canvas = document.createElement('canvas');
  canvas.id = 'hero-fiber-canvas';
  Object.assign(canvas.style, {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    zIndex: '1',
    pointerEvents: 'none',
    mixBlendMode: 'screen'
  });

  // Find container to insert
  const wrapper = document.querySelector('.hero-wrapper');
  if (wrapper) {
    wrapper.prepend(canvas);
  } else {
    // Fallback if class not ready yet
    document.addEventListener('DOMContentLoaded', () => {
      const w = document.querySelector('.hero-wrapper');
      if (w) w.prepend(canvas);
    });
  }

  const ctx = canvas.getContext('2d');
  let W, H;
  let fibers = [];
  const mouse = { x: -1000, y: -1000, targetX: -1000, targetY: -1000, active: false };

  function resize() {
    if (!canvas.parentElement) return;
    W = canvas.width = canvas.parentElement.clientWidth;
    H = canvas.height = canvas.parentElement.clientHeight;
    initFibers();
  }
  window.addEventListener('resize', resize);
  
  // Track mouse coordinates relative to the wrapper
  window.addEventListener('mousemove', (e) => {
    if (!canvas.parentElement) return;
    const rect = canvas.parentElement.getBoundingClientRect();
    mouse.targetX = e.clientX - rect.left;
    mouse.targetY = e.clientY - rect.top;
    mouse.active = true;
  });

  window.addEventListener('mouseleave', () => {
    mouse.active = false;
  });

  class FiberSegment {
    constructor(x, y) {
      this.baseX = x;
      this.baseY = y;
      this.x = x;
      this.y = y;
      this.vx = 0;
      this.vy = 0;
    }

    update(swayX, swayY, forceFactor) {
      // Spring back to base position + natural sway
      const targetX = this.baseX + swayX;
      const targetY = this.baseY + swayY;

      // Spring physics
      const ax = (targetX - this.x) * 0.08;
      const ay = (targetY - this.y) * 0.08;

      this.vx += ax;
      this.vy += ay;

      // Mouse displacement
      if (mouse.active) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 200; // Radius of interaction

        if (dist < maxDist) {
          // Push force inversely proportional to distance
          const force = (1.0 - dist / maxDist) * 12 * forceFactor;
          const angle = Math.atan2(dy, dx);
          
          // Apply push force
          this.vx += Math.cos(angle) * force;
          this.vy += Math.sin(angle) * force;
        }
      }

      // Apply damping & update position
      this.vx *= 0.82;
      this.vy *= 0.82;
      this.x += this.vx;
      this.y += this.vy;
    }
  }

  class Fiber {
    constructor(angle, length, colorType) {
      this.angle = angle;
      this.length = length;
      this.colorType = colorType; // 0: Cyan, 1: Magenta, 2: Indigo
      this.segments = [];
      this.numSegments = 5;
      this.swayPhase = Math.random() * Math.PI * 2;
      this.swaySpeed = 0.01 + Math.random() * 0.015;
      this.swayAmp = 8 + Math.random() * 12;

      this.initSegments();
    }

    initSegments() {
      // Origin is at bottom center of the canvas
      const originX = W / 2;
      const originY = H;

      for (let i = 0; i <= this.numSegments; i++) {
        const ratio = i / this.numSegments;
        const dist = this.length * ratio;
        
        // Calculate segment base position radiating from origin
        const bx = originX + Math.cos(this.angle) * dist;
        const by = originY + Math.sin(this.angle) * dist;

        this.segments.push(new FiberSegment(bx, by));
      }
    }

    update(time) {
      this.swayPhase += this.swaySpeed;
      // Sway is larger towards the tips
      const baseSwayX = Math.sin(this.swayPhase) * this.swayAmp;
      const baseSwayY = Math.cos(this.swayPhase) * (this.swayAmp * 0.4);

      const originX = W / 2;
      const originY = H;

      // Update segment base positions if window resized
      this.segments.forEach((seg, idx) => {
        const ratio = idx / this.numSegments;
        const dist = this.length * ratio;
        seg.baseX = originX + Math.cos(this.angle) * dist;
        seg.baseY = originY + Math.sin(this.angle) * dist;

        // Sway factor increases towards the tip
        const sf = ratio * ratio; 
        // Mouse push factor is also stronger at the tip (more flexible)
        const mf = ratio * 1.5;

        seg.update(baseSwayX * sf, baseSwayY * sf, mf);
      });
    }

    draw() {
      if (this.segments.length === 0) return;

      // Determine colors based on type
      let colorStart, colorEnd;
      if (this.colorType === 0) {
        colorStart = 'rgba(99, 102, 241, 0.2)'; // Indigo
        colorEnd = 'rgba(6, 182, 212, 0.95)';  // Cyan
      } else if (this.colorType === 1) {
        colorStart = 'rgba(168, 85, 247, 0.2)'; // Purple
        colorEnd = 'rgba(217, 70, 239, 0.95)'; // Magenta
      } else {
        colorStart = 'rgba(99, 102, 241, 0.2)'; // Indigo
        colorEnd = 'rgba(168, 85, 247, 0.95)'; // Purple
      }

      // Draw the fiber line
      ctx.beginPath();
      ctx.moveTo(this.segments[0].x, this.segments[0].y);
      
      for (let i = 1; i < this.segments.length; i++) {
        // Curve to make it look smooth
        const xc = (this.segments[i - 1].x + this.segments[i].x) / 2;
        const yc = (this.segments[i - 1].y + this.segments[i].y) / 2;
        ctx.quadraticCurveTo(this.segments[i - 1].x, this.segments[i - 1].y, xc, yc);
      }
      
      const lastSeg = this.segments[this.segments.length - 1];
      ctx.lineTo(lastSeg.x, lastSeg.y);

      // Gradient stroke
      const grad = ctx.createLinearGradient(W/2, H, lastSeg.x, lastSeg.y);
      grad.addColorStop(0, colorStart);
      grad.addColorStop(1, colorEnd);

      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Draw glowing end node (tip)
      const pulse = 1.0 + 0.25 * Math.sin(this.swayPhase * 1.5);
      ctx.beginPath();
      ctx.arc(lastSeg.x, lastSeg.y, 2.5 * pulse, 0, Math.PI * 2);
      ctx.fillStyle = colorEnd;
      
      // Node glow effect
      ctx.shadowBlur = 12 * pulse;
      ctx.shadowColor = colorEnd;
      ctx.fill();
      ctx.shadowBlur = 0; // Reset shadow

      // Draw optional smaller mid nodes
      if (this.angle % 2 === 0) {
        const midSeg = this.segments[3];
        ctx.beginPath();
        ctx.arc(midSeg.x, midSeg.y, 1.2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.fill();
      }
    }
  }

  function initFibers() {
    fibers = [];
    // Number of fiber strands radiating outwards in a fan shape
    const numStrands = 130;
    const minAngle = -Math.PI * 0.95; // Pointing leftish
    const maxAngle = -Math.PI * 0.05; // Pointing rightish
    
    // Choose length proportional to size
    const baseLength = Math.min(W, H) * 0.75;

    for (let i = 0; i < numStrands; i++) {
      const ratio = i / (numStrands - 1);
      const angle = minAngle + ratio * (maxAngle - minAngle);
      
      // Add slight length variation
      const len = baseLength * (0.6 + Math.random() * 0.45);
      
      // Choose color pattern
      const colorType = Math.floor(Math.random() * 3);
      fibers.push(new Fiber(angle, len, colorType));
    }
  }

  function animate(time) {
    if (!W || !H) return requestAnimationFrame(animate);

    ctx.clearRect(0, 0, W, H);

    // Smoothly ease mouse to target for lag-free physics response
    mouse.x += (mouse.targetX - mouse.x) * 0.12;
    mouse.y += (mouse.targetY - mouse.y) * 0.12;

    fibers.forEach(f => {
      f.update(time);
      f.draw();
    });

    requestAnimationFrame(animate);
  }

  // Initial trigger
  setTimeout(() => {
    resize();
    requestAnimationFrame(animate);
  }, 100);

})();
