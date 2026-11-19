/**
 * Global Twinkling Universe Starfield
 * Chạy nền cố định trên toàn bộ các trang của web Trạm kiểm soát vũ trụ.
 */
(function () {
  let canvas = document.getElementById('global-starfield');
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.id = 'global-starfield';
    canvas.setAttribute('aria-hidden', 'true');
    document.body.prepend(canvas);
  }

  const ctx = canvas.getContext('2d');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const palette = ['#F8FAFC', '#E0F2FE', '#BAE6FD', '#FEF3C7'];

  const stars = Array.from({ length: 140 }, (_, i) => ({
    x: ((i * 79 + 23) % 1000) / 1000,
    y: ((i * 151 + 47) % 1000) / 1000,
    r: i % 8 === 0 ? 1.85 : i % 3 === 0 ? 1.2 : 0.75,
    baseAlpha: 0.25 + (i % 5) * 0.12,
    speed: 0.8 + (i % 6) * 0.42,
    phase: i * 1.23,
    color: palette[i % palette.length],
    cross: i % 17 === 0
  }));

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.floor(window.innerWidth * dpr));
    canvas.height = Math.max(1, Math.floor(window.innerHeight * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  window.addEventListener('resize', resize);
  resize();

  function draw(now) {
    const tSec = now * 0.001;
    const w = window.innerWidth;
    const h = window.innerHeight;
    const scrollShift = (window.scrollY || 0) * 0.06;

    ctx.clearRect(0, 0, w, h);

    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];
      const twinkle = reduced ? 1 : 0.42 + 0.58 * (0.5 + 0.5 * Math.sin(tSec * s.speed + s.phase));
      const alpha = s.baseAlpha * twinkle;
      const sx = s.x * w;
      const sy = ((s.y * h - scrollShift * (0.4 + s.r * 0.25)) % h + h) % h;

      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = s.color;
      ctx.beginPath();
      ctx.arc(sx, sy, s.r, 0, Math.PI * 2);
      ctx.fill();

      if (s.cross && twinkle > 0.72) {
        ctx.strokeStyle = s.color;
        ctx.lineWidth = 0.75;
        const arm = s.r * 3.3 * twinkle;
        ctx.beginPath();
        ctx.moveTo(sx - arm, sy);
        ctx.lineTo(sx + arm, sy);
        ctx.moveTo(sx, sy - arm);
        ctx.lineTo(sx, sy + arm);
        ctx.stroke();
      }
      ctx.restore();
    }

    if (!reduced) requestAnimationFrame(draw);
  }

  if (reduced) {
    draw(0);
  } else {
    requestAnimationFrame(draw);
  }
})();
