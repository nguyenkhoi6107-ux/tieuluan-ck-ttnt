/**
 * Meteor Trails in Space (Dual-layer: behind & in front of the Hero Title)
 * Thiên thạch bay xẹt qua lại trong không gian, xuyên qua lớp chữ tiêu đề
 * và để lại dấu vết là những đường thẳng hình học sắc nét.
 */
(function () {
  const backCanvas = document.getElementById('meteor-canvas-back');
  const frontCanvas = document.getElementById('meteor-canvas-front');
  const heroAct = document.getElementById('act-hero');
  if (!backCanvas || !frontCanvas) return;

  const bCtx = backCanvas.getContext('2d');
  const fCtx = frontCanvas.getContext('2d');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resizeCanvas(c, ctx) {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = c.getBoundingClientRect();
    c.width = Math.max(1, Math.floor(rect.width * dpr));
    c.height = Math.max(1, Math.floor(rect.height * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function resizeAll() {
    resizeCanvas(backCanvas, bCtx);
    resizeCanvas(frontCanvas, fCtx);
  }
  window.addEventListener('resize', resizeAll);
  resizeAll();

  // Twinkling starfield (drawn on back canvas behind meteors & title)
  const starPalette = ['#F8FAFC', '#E0F2FE', '#BAE6FD', '#FEF3C7'];
  const stars = Array.from({ length: 120 }, (_, i) => ({
    x: ((i * 73 + 19) % 1000) / 1000,
    y: ((i * 137 + 43) % 1000) / 1000,
    r: (i % 7 === 0) ? 1.8 : (i % 3 === 0 ? 1.25 : 0.8),
    baseAlpha: 0.28 + (i % 5) * 0.11,
    speed: 0.9 + (i % 6) * 0.45,
    phase: i * 1.17,
    color: starPalette[i % starPalette.length],
    cross: i % 19 === 0 // occasional bright 4-point sparkle star
  }));

  function drawStars(ctx, w, h, tSec, scrollP) {
    const yOffset = (scrollP - 0.5) * -18;
    stars.forEach((s) => {
      const twinkle = reduced ? 1 : 0.45 + 0.55 * (0.5 + 0.5 * Math.sin(tSec * s.speed + s.phase));
      const alpha = s.baseAlpha * twinkle;
      const sx = s.x * w;
      const sy = ((s.y * h + yOffset + h) % h);

      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = s.color;
      ctx.beginPath();
      ctx.arc(sx, sy, s.r, 0, Math.PI * 2);
      ctx.fill();

      if (s.cross && twinkle > 0.72) {
        ctx.strokeStyle = s.color;
        ctx.lineWidth = 0.7;
        const arm = s.r * 3.4 * twinkle;
        ctx.beginPath();
        ctx.moveTo(sx - arm, sy);
        ctx.lineTo(sx + arm, sy);
        ctx.moveTo(sx, sy - arm);
        ctx.lineTo(sx, sy + arm);
        ctx.stroke();
      }
      ctx.restore();
    });
  }

  // Define meteors on two depth planes: 'back' (behind title) and 'front' (passes across title)
  const meteors = [
    // Back plane: deeper, slower, leaving persistent line trajectories
    { layer: 'back', x0: -0.1, y0: 0.22, dx: 1.25, dy: 0.34, speed: 0.16, phase: 0.05, color: '#38BDF8', radius: 3.0, lineAlpha: 0.26 },
    { layer: 'back', x0: 1.12, y0: 0.16, dx: -1.25, dy: 0.46, speed: 0.13, phase: 0.42, color: '#2DD4BF', radius: 2.6, lineAlpha: 0.22 },
    { layer: 'back', x0: -0.08, y0: 0.82, dx: 1.22, dy: -0.48, speed: 0.14, phase: 0.72, color: '#7DD3FC', radius: 2.8, lineAlpha: 0.22 },

    // Front plane: closer, faster, visibly streaks across the title text!
    { layer: 'front', x0: -0.12, y0: 0.56, dx: 1.28, dy: -0.26, speed: 0.24, phase: 0.18, color: '#F8FAFC', glow: '#38BDF8', radius: 4.2, lineAlpha: 0.38 },
    { layer: 'front', x0: 1.10, y0: 0.68, dx: -1.25, dy: -0.32, speed: 0.21, phase: 0.64, color: '#FDE68A', glow: '#F59E0B', radius: 3.8, lineAlpha: 0.32 }
  ];

  function getScrollP() {
    if (!heroAct) return 0;
    const raw = getComputedStyle(heroAct).getPropertyValue('--sc-p').trim();
    const v = parseFloat(raw);
    return Number.isFinite(v) ? Math.max(0, Math.min(1, v)) : 0;
  }

  function drawLayer(ctx, canvas, layerName, tSec, scrollP) {
    const rect = canvas.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    ctx.clearRect(0, 0, w, h);

    // Subtle scroll-driven tilt/shift of the trajectory lines
    const yShift = (scrollP - 0.5) * (layerName === 'front' ? -56 : 28);

    meteors.forEach((m) => {
      if (m.layer !== layerName) return;

      const sx = m.x0 * w;
      const sy = m.y0 * h + yShift;
      const ex = (m.x0 + m.dx) * w;
      const ey = (m.y0 + m.dy) * h + yShift;

      // 1. Persistent geometric line trail in space (shows the straight line formed by the meteor)
      ctx.save();
      ctx.strokeStyle = m.color;
      ctx.globalAlpha = m.lineAlpha;
      ctx.lineWidth = layerName === 'front' ? 1.25 : 1.0;
      ctx.setLineDash([7, 6]);
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(ex, ey);
      ctx.stroke();
      ctx.restore();

      // 2. Moving meteor head + bright wake
      const prog = reduced ? 0.52 : ((tSec * m.speed + m.phase) % 1);
      const mx = sx + (ex - sx) * prog;
      const my = sy + (ey - sy) * prog;

      // Wake tail behind the meteor
      const tailLen = 0.14;
      const tx = sx + (ex - sx) * Math.max(0, prog - tailLen);
      const ty = sy + (ey - sy) * Math.max(0, prog - tailLen);

      const grad = ctx.createLinearGradient(tx, ty, mx, my);
      grad.addColorStop(0, 'rgba(56, 189, 248, 0)');
      grad.addColorStop(0.65, m.glow || m.color);
      grad.addColorStop(1, '#FFFFFF');

      ctx.save();
      ctx.strokeStyle = grad;
      ctx.lineWidth = layerName === 'front' ? 2.8 : 2.0;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(tx, ty);
      ctx.lineTo(mx, my);
      ctx.stroke();

      // Meteor core
      ctx.fillStyle = '#FFFFFF';
      ctx.shadowColor = m.glow || m.color;
      ctx.shadowBlur = layerName === 'front' ? 14 : 8;
      ctx.beginPath();
      ctx.arc(mx, my, m.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  }

  function frame(now) {
    const tSec = now * 0.001;
    const scrollP = getScrollP();
    drawLayer(bCtx, backCanvas, 'back', tSec, scrollP);
    drawLayer(fCtx, frontCanvas, 'front', tSec, scrollP);
    if (!reduced) requestAnimationFrame(frame);
  }

  if (reduced) {
    drawLayer(bCtx, backCanvas, 'back', 0, 0);
    drawLayer(fCtx, frontCanvas, 'front', 0, 0);
  } else {
    requestAnimationFrame(frame);
  }
})();
