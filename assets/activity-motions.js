/**
 * Representative Motions for Each Classroom Activity on index.html
 * 1. Khởi động: Phác thảo bản vẽ -> Đường thẳng quỹ đạo
 * 2. Khám phá: Điểm M(t) trượt theo vectơ chỉ phương u (AM = t·u)
 * 3. Thử thách 3D: Radar 2D tự nghiêng sang Không gian 3D (Báo động thật vs giả)
 * 4. Luyện tập: Đường đua tốc độ giải toán điền số
 */
(function () {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function setupHiDPI(canvas) {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return null;
    canvas.width = Math.floor(rect.width * dpr);
    canvas.height = Math.floor(rect.height * dpr);
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { ctx, w: rect.width, h: rect.height };
  }

  // 1. KHỞI ĐỘNG: Engineer Blueprint Sketch -> Straight Line Path
  const c1 = document.getElementById('motion-hd1');
  // 2. KHÁM PHÁ: Vector u & Parameter t sliding M = A + t*u
  const c2 = document.getElementById('motion-hd2');
  // 3. THỬ THÁCH 3D: 2D Radar <-> 3D Oxyz tilt
  const c3 = document.getElementById('motion-hd3');
  // 4. LUYỆN TẬP: Space Race Lanes
  const c4 = document.getElementById('motion-hd4');

  function drawHD1(t) {
    if (!c1) return;
    const g = setupHiDPI(c1);
    if (!g) return;
    const { ctx, w, h } = g;
    ctx.clearRect(0, 0, w, h);

    // Subtle blueprint grid
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.08)';
    ctx.lineWidth = 1;
    for (let x = 24; x < w; x += 32) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    }
    for (let y = 24; y < h; y += 32) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }

    const ax = w * 0.14, ay = h * 0.72;
    const bx = w * 0.86, by = h * 0.28;

    // Rough curved/broken real-world obstacle path (dashed)
    ctx.save();
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.35)';
    ctx.setLineDash([5, 5]);
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(ax, ay);
    ctx.bezierCurveTo(w * 0.35, h * 0.88, w * 0.62, h * 0.15, bx, by);
    ctx.stroke();
    ctx.restore();

    // Animated straight blueprint line being drawn from A to B
    const prog = reduced ? 1 : (Math.sin(t * 0.9) * 0.5 + 0.5) * 0.85 + 0.15;
    const cx = ax + (bx - ax) * prog;
    const cy = ay + (by - ay) * prog;

    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 2.6;
    ctx.beginPath();
    ctx.moveTo(ax, ay);
    ctx.lineTo(cx, cy);
    ctx.stroke();

    // Points A & B + moving pen dot
    [
      { x: ax, y: ay, label: 'A (Điểm đầu)' },
      { x: bx, y: by, label: 'B (Đích)' }
    ].forEach((pt) => {
      ctx.fillStyle = '#0F172A';
      ctx.strokeStyle = '#38BDF8';
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(pt.x, pt.y, 5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#94A3B8';
      ctx.font = '500 11px "JetBrains Mono", monospace';
      ctx.fillText(pt.label, pt.x - 24, pt.y + 18);
    });

    ctx.fillStyle = '#F8FAFC';
    ctx.shadowColor = '#38BDF8';
    ctx.shadowBlur = 12;
    ctx.beginPath(); ctx.arc(cx, cy, 4.5, 0, Math.PI * 2); ctx.fill();
    ctx.shadowBlur = 0;
  }

  function drawHD2(t) {
    if (!c2) return;
    const g = setupHiDPI(c2);
    if (!g) return;
    const { ctx, w, h } = g;
    ctx.clearRect(0, 0, w, h);

    // Clean visual of a point gliding along a straight line following a direction arrow
    const x1 = w * 0.12, y1 = h * 0.76;
    const x2 = w * 0.88, y2 = h * 0.24;
    const ax = w * 0.34, ay = h * 0.61;
    const ux = (x2 - x1) * 0.22, uy = (y2 - y1) * 0.22;

    // Base line
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.32)';
    ctx.lineWidth = 1.8;
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();

    // Direction arrow alongside line
    const vx0 = ax + 14, vy0 = ay + 24;
    ctx.strokeStyle = '#2DD4BF';
    ctx.lineWidth = 2.4;
    ctx.beginPath(); ctx.moveTo(vx0, vy0); ctx.lineTo(vx0 + ux, vy0 + uy); ctx.stroke();
    ctx.fillStyle = '#2DD4BF';
    ctx.beginPath(); ctx.arc(vx0 + ux, vy0 + uy, 3.5, 0, Math.PI * 2); ctx.fill();

    // Moving point gliding along the straight line
    const prog = reduced ? 0.6 : (Math.sin(t * 1.1) * 0.5 + 0.5);
    const mx = x1 + (x2 - x1) * (0.2 + prog * 0.65);
    const my = y1 + (y2 - y1) * (0.2 + prog * 0.65);

    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(mx, my); ctx.stroke();

    ctx.fillStyle = '#F8FAFC';
    ctx.beginPath(); ctx.arc(ax, ay, 4.5, 0, Math.PI * 2); ctx.fill();

    ctx.fillStyle = '#38BDF8';
    ctx.shadowColor = '#38BDF8';
    ctx.shadowBlur = 12;
    ctx.beginPath(); ctx.arc(mx, my, 6, 0, Math.PI * 2); ctx.fill();
    ctx.shadowBlur = 0;
  }

  function drawHD3(t) {
    if (!c3) return;
    const g = setupHiDPI(c3);
    if (!g) return;
    const { ctx, w, h } = g;
    ctx.clearRect(0, 0, w, h);

    // Smooth oscillation between flat view and 3D space view (no coordinates or formulas)
    const morph = reduced ? 0.8 : 0.5 - 0.5 * Math.cos(t * 0.75);
    const pitch = (Math.PI * 0.48) * (1 - morph) + 0.45 * morph;
    const yaw = -0.25 + morph * 0.55;
    const cx = w * 0.5, cy = h * 0.54;
    const scale = Math.min(w, h) * 0.085;

    function proj(pt) {
      const x = pt[0] - 5, y = pt[1] - 1, z = pt[2];
      const rx = x * Math.cos(yaw) - y * Math.sin(yaw);
      const ry = x * Math.sin(yaw) + y * Math.cos(yaw);
      const sy = -(ry * Math.sin(pitch) + z * Math.cos(pitch));
      return { x: cx + rx * scale, y: cy + sy * scale };
    }

    // Space reference grid
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.13)';
    ctx.lineWidth = 1;
    for (let i = 1; i <= 9; i += 2) {
      const a = proj([i, -1, 0]), b = proj([i, 3, 0]);
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
    }
    for (let j = -1; j <= 3; j += 1) {
      const a = proj([1, j, 0]), b = proj([9, j, 0]);
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
    }

    // Three trajectories: Main line, Intersecting line, Skew line
    const segs = [
      { a: [2, -1, 3], b: [9, 2.5, -4], color: '#EF4444', name: 'Quỹ đạo chính' },
      { a: [3, 1, -4], b: [8, 1, 1], color: '#F59E0B', name: 'Cắt nhau' },
      { a: [4, 2, -3], b: [9, 2, 2], color: '#A78BFA', name: 'Chéo nhau' }
    ];
    segs.forEach((s) => {
      const p1 = proj(s.a), p2 = proj(s.b);
      ctx.strokeStyle = s.color;
      ctx.lineWidth = 2.4;
      ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
      ctx.fillStyle = s.color;
      ctx.font = '600 11px "Be Vietnam Pro", sans-serif';
      ctx.fillText(s.name, p2.x + 6, p2.y);
    });

    // Vertical gap showing the skew lines don't actually touch
    const t1False = proj([8, 2, -3]), v4False = proj([8, 2, 1]);
    ctx.save();
    ctx.strokeStyle = '#FCD34D';
    ctx.setLineDash([3, 3]);
    ctx.beginPath(); ctx.moveTo(t1False.x, t1False.y); ctx.lineTo(v4False.x, v4False.y); ctx.stroke();
    ctx.restore();
  }

  function drawHD4(t) {
    if (!c4) return;
    const g = setupHiDPI(c4);
    if (!g) return;
    const { ctx, w, h } = g;
    ctx.clearRect(0, 0, w, h);

    const cx = w * 0.52;
    const cy = h * 0.50;
    const floatY = reduced ? 0 : Math.sin(t * 1.15) * 9;
    const floatX = reduced ? 0 : Math.cos(t * 0.85) * 5;
    const px = cx + floatX;
    const py = cy + floatY;
    const pulse = reduced ? 0 : Math.sin(t * 2.2);

    const planetR = Math.min(w, h) * 0.29 * (1 + pulse * 0.018);
    const ringRx = planetR * 1.62;
    const ringRy = planetR * 0.44;
    const ringTilt = -0.26;

    // 1. Deep Cosmic Nebula Aura (blends seamlessly into the space starfield without any border cut)
    const nebula = ctx.createRadialGradient(px, py, planetR * 0.2, px, py, planetR * 2.35);
    nebula.addColorStop(0, 'rgba(229, 53, 76, 0.36)');
    nebula.addColorStop(0.42, 'rgba(195, 20, 45, 0.14)');
    nebula.addColorStop(0.75, 'rgba(56, 189, 248, 0.04)');
    nebula.addColorStop(1, 'rgba(7, 11, 20, 0)');
    ctx.fillStyle = nebula;
    ctx.beginPath();
    ctx.arc(px, py, planetR * 2.35, 0, Math.PI * 2);
    ctx.fill();

    // 2. Back Half of Planetary Ring + Orbiting Mini-Moons (behind planet)
    const orbitAngle1 = reduced ? 0.8 : t * 0.65;
    const orbitAngle2 = reduced ? 3.9 : t * 0.42 + 2.4;

    function drawOrbitingMoons(behind) {
      [
        { a: orbitAngle1, rx: ringRx * 1.02, ry: ringRy * 1.02, r: 4.5, col: '#FDE68A', glow: '#F59E0B' },
        { a: orbitAngle2, rx: ringRx * 0.86, ry: ringRy * 0.86, r: 3.2, col: '#7DD3FC', glow: '#38BDF8' }
      ].forEach((m) => {
        const sinA = Math.sin(m.a);
        const isBehind = sinA < 0;
        if (isBehind !== behind) return;

        const lx = Math.cos(m.a) * m.rx;
        const ly = sinA * m.ry;
        const cosT = Math.cos(ringTilt);
        const sinT = Math.sin(ringTilt);
        const mx = px + lx * cosT - ly * sinT;
        const my = py + lx * sinT + ly * cosT;

        ctx.save();
        ctx.fillStyle = m.col;
        ctx.shadowColor = m.glow;
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(mx, my, m.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
    }

    // Back ring arc (π to 2π)
    ctx.save();
    ctx.translate(px, py);
    ctx.rotate(ringTilt);
    ctx.strokeStyle = 'rgba(255, 154, 60, 0.25)';
    ctx.lineWidth = 3.2;
    ctx.beginPath();
    ctx.ellipse(0, 0, ringRx, ringRy, 0, Math.PI, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(229, 53, 76, 0.16)';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.ellipse(0, 0, ringRx * 0.92, ringRy * 0.92, 0, Math.PI, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    drawOrbitingMoons(true);

    // 3. The Blood-Moon Planet Sphere (3D Volumetric Lighting like Hero Planets)
    ctx.save();
    const planetGrad = ctx.createRadialGradient(
      px - planetR * 0.34, py - planetR * 0.34, planetR * 0.08,
      px, py, planetR
    );
    planetGrad.addColorStop(0, '#FFB088');
    planetGrad.addColorStop(0.32, '#E5354C');
    planetGrad.addColorStop(0.68, '#880A1F');
    planetGrad.addColorStop(1, '#1A030B');

    ctx.shadowColor = 'rgba(229, 53, 76, 0.48)';
    ctx.shadowBlur = 36;
    ctx.fillStyle = planetGrad;
    ctx.beginPath();
    ctx.arc(px, py, planetR, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Clip to planet sphere for surface bands, craters & terminator shadow
    ctx.beginPath();
    ctx.arc(px, py, planetR, 0, Math.PI * 2);
    ctx.clip();

    // Subtle planetary surface craters
    ctx.fillStyle = 'rgba(30, 3, 12, 0.30)';
    ctx.beginPath();
    ctx.arc(px - planetR * 0.36, py - planetR * 0.22, planetR * 0.18, 0, Math.PI * 2);
    ctx.arc(px + planetR * 0.38, py + planetR * 0.26, planetR * 0.15, 0, Math.PI * 2);
    ctx.arc(px - planetR * 0.14, py + planetR * 0.45, planetR * 0.11, 0, Math.PI * 2);
    ctx.fill();

    // Inner crescent shadow (bottom-right) for 3D planetary depth
    const innerShadow = ctx.createRadialGradient(
      px - planetR * 0.28, py - planetR * 0.28, planetR * 0.45,
      px + planetR * 0.22, py + planetR * 0.22, planetR * 1.08
    );
    innerShadow.addColorStop(0, 'rgba(0, 0, 0, 0)');
    innerShadow.addColorStop(0.7, 'rgba(8, 2, 12, 0.38)');
    innerShadow.addColorStop(1, 'rgba(4, 2, 10, 0.84)');
    ctx.fillStyle = innerShadow;
    ctx.fillRect(px - planetR, py - planetR, planetR * 2, planetR * 2);
    ctx.restore();

    // Subtle atmospheric rim highlight
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 185, 160, 0.38)';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.arc(px, py, planetR, -Math.PI * 0.85, -Math.PI * 0.15);
    ctx.stroke();
    ctx.restore();

    // 4. Iconic Foxy Running Geometric Fox Emblem (Floating & Breathing on the Blood-Moon Planet)
    const foxScale = (planetR * 1.12) / 16;
    const foxY = py + (reduced ? 0 : Math.sin(t * 2.3) * 2.5);

    ctx.save();
    ctx.translate(px, foxY);
    ctx.scale(foxScale, foxScale);
    ctx.translate(-16, -16.5);

    ctx.shadowColor = 'rgba(255, 196, 107, 0.65)';
    ctx.shadowBlur = 16;
    const foxGrad = ctx.createLinearGradient(16, 4, 16, 28);
    foxGrad.addColorStop(0, '#1C0613');
    foxGrad.addColorStop(0.6, '#11030B');
    foxGrad.addColorStop(1, '#2B0715');
    ctx.fillStyle = foxGrad;
    ctx.strokeStyle = 'rgba(255, 224, 178, 0.92)';
    ctx.lineWidth = 0.95;
    ctx.lineJoin = 'round';

    ctx.beginPath();
    ctx.moveTo(4, 5);
    ctx.lineTo(11, 12);
    ctx.lineTo(21, 12);
    ctx.lineTo(28, 5);
    ctx.lineTo(26, 18);
    ctx.lineTo(16, 28);
    ctx.lineTo(6, 18);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Geometric facet lines inside the Fox emblem
    ctx.strokeStyle = 'rgba(255, 154, 60, 0.38)';
    ctx.lineWidth = 0.65;
    ctx.beginPath();
    ctx.moveTo(4, 5); ctx.lineTo(11, 18);
    ctx.moveTo(28, 5); ctx.lineTo(21, 18);
    ctx.moveTo(11, 12); ctx.lineTo(16, 28);
    ctx.moveTo(21, 12); ctx.lineTo(16, 28);
    ctx.stroke();

    // Glowing Fox Eyes (periodic natural blink + ember pulse)
    const blinkCycle = reduced ? 1 : Math.sin(t * 1.75);
    const eyeOpen = blinkCycle > -0.93 ? 1 : 0.14;
    const eyeGlow = 0.78 + 0.22 * Math.sin(t * 4.5);

    ctx.fillStyle = `rgba(255, 232, 155, ${eyeGlow})`;
    ctx.shadowColor = '#FF3A3A';
    ctx.shadowBlur = 10;

    ctx.beginPath();
    ctx.ellipse(12, 17, 1.85, 1.55 * eyeOpen, 0.18, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(20, 17, 1.85, 1.55 * eyeOpen, -0.18, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 5. Front Half of Planetary Ring + Front Orbiting Moons (crosses in front of planet)
    ctx.save();
    ctx.translate(px, py);
    ctx.rotate(ringTilt);

    ctx.strokeStyle = 'rgba(255, 180, 120, 0.52)';
    ctx.lineWidth = 2.6;
    ctx.shadowColor = 'rgba(255, 154, 60, 0.45)';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.ellipse(0, 0, ringRx, ringRy, 0, 0, Math.PI);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(229, 53, 76, 0.28)';
    ctx.lineWidth = 7;
    ctx.shadowBlur = 0;
    ctx.beginPath();
    ctx.ellipse(0, 0, ringRx * 0.92, ringRy * 0.92, 0, 0, Math.PI);
    ctx.stroke();
    ctx.restore();

    drawOrbitingMoons(false);

    // 6. Floating Cosmic Star Dust around the Planet
    for (let i = 0; i < 12; i++) {
      const angle = i * 0.52 + (reduced ? 0 : t * 0.22 * (i % 2 === 0 ? 1 : -1));
      const dist = planetR * (1.22 + (i % 4) * 0.22);
      const sx = px + Math.cos(angle) * dist * 1.15;
      const sy = py + Math.sin(angle) * dist * 0.78;
      const alpha = reduced ? 0.65 : 0.3 + 0.65 * Math.abs(Math.sin(t * 2.1 + i));

      ctx.fillStyle = i % 3 === 0
        ? `rgba(253, 230, 138, ${alpha})`
        : i % 2 === 0
          ? `rgba(255, 130, 150, ${alpha})`
          : `rgba(125, 211, 252, ${alpha})`;
      ctx.beginPath();
      ctx.arc(sx, sy, 1.4 + (i % 2) * 0.8, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // 5. LONG SHOOTING-STAR BRIDGES (Main Star + Companion Mini Shooting Stars)
  //    & SCROLL-DRIVEN GROW / SHRINK FOR EACH ACTIVITY BAND
  const bridgeCanvases = Array.from(document.querySelectorAll('.bridge-canvas'));
  const activityBands = Array.from(document.querySelectorAll('.activity-band'));

  // Companion mini shooting stars offset parallel to the main bridge
  const companions = [
    { perpOffset: -36, lag: -0.06, tailLen: 0.14, r: 2.3, color: '#7DD3FC', alpha: 0.85 },
    { perpOffset: 32,  lag: -0.11, tailLen: 0.12, r: 2.0, color: '#5EEAD4', alpha: 0.80 },
    { perpOffset: -64, lag: -0.17, tailLen: 0.10, r: 1.6, color: '#BAE6FD', alpha: 0.65 },
    { perpOffset: 58,  lag: -0.03, tailLen: 0.11, r: 1.8, color: '#FDE68A', alpha: 0.72 }
  ];

  function updateActivityScale() {
    if (reduced) return;
    const vh = window.innerHeight || 800;
    const centerVh = vh * 0.5;

    activityBands.forEach((band) => {
      const rect = band.getBoundingClientRect();
      const bandCenter = rect.top + rect.height * 0.5;
      const dist = Math.min(1, Math.abs(bandCenter - centerVh) / (vh * 0.78));
      const focus = 0.5 * (1 + Math.cos(dist * Math.PI));
      const scale = 0.74 + 0.26 * focus;
      const opacity = 0.34 + 0.66 * focus;

      band.style.transform = `scale(${scale.toFixed(4)})`;
      band.style.opacity = opacity.toFixed(3);
    });
  }

  function getBridgeProgress(el) {
    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight || 800;
    // Long scroll travel across the viewport
    const startY = vh * 0.88;
    const endY = vh * 0.18;
    const raw = (startY - rect.top) / Math.max(1, startY - endY);
    return Math.max(0, Math.min(1, raw));
  }

  function drawSingleShootingStar(ctx, sx, sy, ex, ey, prog, tailFraction, radius, color, alpha, drawFlare) {
    if (prog <= 0.01) return;
    const clampedP = Math.max(0, Math.min(1, prog));
    const mx = sx + (ex - sx) * clampedP;
    const my = sy + (ey - sy) * clampedP;
    const tailP = Math.max(0, clampedP - tailFraction);
    const tx = sx + (ex - sx) * tailP;
    const ty = sy + (ey - sy) * tailP;

    const tailGrad = ctx.createLinearGradient(tx, ty, mx, my);
    tailGrad.addColorStop(0, 'rgba(56, 189, 248, 0)');
    tailGrad.addColorStop(0.55, color);
    tailGrad.addColorStop(1, '#FFFFFF');

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = tailGrad;
    ctx.lineWidth = radius * 0.85;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(tx, ty);
    ctx.lineTo(mx, my);
    ctx.stroke();

    ctx.fillStyle = '#FFFFFF';
    ctx.shadowColor = color;
    ctx.shadowBlur = radius * 3.8;
    ctx.beginPath();
    ctx.arc(mx, my, radius, 0, Math.PI * 2);
    ctx.fill();

    if (drawFlare) {
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1.15;
      const arm = radius * 2.4;
      ctx.beginPath();
      ctx.moveTo(mx - arm, my); ctx.lineTo(mx + arm, my);
      ctx.moveTo(mx, my - arm); ctx.lineTo(mx, my + arm);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawBridges(t) {
    bridgeCanvases.forEach((canvas, idx) => {
      const g = setupHiDPI(canvas);
      if (!g) return;
      const { ctx, w, h } = g;
      ctx.clearRect(0, 0, w, h);

      const dir = canvas.getAttribute('data-dir') || 'ltr';
      const targetId = canvas.getAttribute('data-target');
      const prog = reduced ? 1 : getBridgeProgress(canvas);

      if (targetId) {
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          targetEl.classList.toggle('is-connected', prog > 0.82);
        }
      }

      // Long diagonal straight-line coordinates
      let sx, sy, ex, ey;
      if (dir === 'center-to-left') {
        sx = w * 0.52; sy = 18;
        ex = w * 0.20; ey = h - 18;
      } else if (dir === 'ltr') {
        sx = w * 0.18; sy = 18;
        ex = w * 0.82; ey = h - 18;
      } else if (dir === 'rtl') {
        sx = w * 0.82; sy = 18;
        ex = w * 0.18; ey = h - 18;
      } else {
        sx = w * 0.20; sy = 18;
        ex = w * 0.54; ey = h - 18;
      }

      // Perpendicular unit vector for parallel companion shooting stars
      const dx = ex - sx;
      const dy = ey - sy;
      const len = Math.hypot(dx, dy) || 1;
      const nx = -dy / len;
      const ny = dx / len;

      // 1. Faint guide straight line (main + subtle side rails)
      ctx.save();
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.20)';
      ctx.lineWidth = 1.4;
      ctx.setLineDash([7, 7]);
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(ex, ey);
      ctx.stroke();
      ctx.restore();

      // Start waypoint node
      ctx.fillStyle = '#38BDF8';
      ctx.beginPath();
      ctx.arc(sx, sy, 4.5, 0, Math.PI * 2);
      ctx.fill();

      // 2. Active extending straight light-bridge + shooting star squadron
      if (prog > 0.01) {
        const cx = sx + dx * prog;
        const cy = sy + dy * prog;

        const beamGrad = ctx.createLinearGradient(sx, sy, cx, cy);
        beamGrad.addColorStop(0, 'rgba(56, 189, 248, 0.18)');
        beamGrad.addColorStop(0.55, '#38BDF8');
        beamGrad.addColorStop(1, '#5EEAD4');

        ctx.save();
        ctx.strokeStyle = beamGrad;
        ctx.lineWidth = 2.8;
        ctx.shadowColor = '#38BDF8';
        ctx.shadowBlur = 14;
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(cx, cy);
        ctx.stroke();
        ctx.restore();

        // Base lead progress (follows scroll while extending; loops gently once fully connected)
        const baseStarP = prog < 0.98 ? prog : ((t * 0.42 + idx * 0.25) % 1);

        // Draw main lead shooting star with long tail (0.28 of bridge length!)
        drawSingleShootingStar(ctx, sx, sy, ex, ey, baseStarP, 0.28, 4.8, '#38BDF8', 1, true);

        // Draw companion mini shooting stars flying alongside the main bridge
        companions.forEach((c, cIdx) => {
          const wob = Math.sin(t * 2.2 + cIdx * 1.7) * 4;
          const off = c.perpOffset + wob;
          const csx = sx + nx * off;
          const csy = sy + ny * off;
          const cex = ex + nx * off;
          const cey = ey + ny * off;

          // Faint companion trail line
          const cProg = Math.max(0, Math.min(1, baseStarP + c.lag));
          if (cProg > 0.02) {
            ctx.save();
            ctx.strokeStyle = c.color;
            ctx.globalAlpha = 0.14;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(csx, csy);
            ctx.lineTo(csx + (cex - csx) * cProg, csy + (cey - csy) * cProg);
            ctx.stroke();
            ctx.restore();

            drawSingleShootingStar(ctx, csx, csy, cex, cey, cProg, c.tailLen, c.r, c.color, c.alpha, false);
          }
        });

        // Sparkling dust particles along the main bridge
        ctx.save();
        for (let k = 1; k <= 6; k++) {
          const dp = Math.max(0, baseStarP - k * 0.036);
          const px = sx + dx * dp + Math.sin(t * 4.5 + k * 2.1) * 8;
          const py = sy + dy * dp + Math.cos(t * 3.8 + k * 1.9) * 6;
          ctx.fillStyle = k % 2 === 0 ? '#BAE6FD' : '#5EEAD4';
          ctx.globalAlpha = Math.max(0.1, 0.78 - k * 0.11);
          ctx.beginPath();
          ctx.arc(px, py, 1.7, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      // Destination waypoint node
      ctx.save();
      ctx.fillStyle = prog > 0.92 ? '#5EEAD4' : '#0F172A';
      ctx.strokeStyle = prog > 0.92 ? '#5EEAD4' : 'rgba(148, 163, 184, 0.45)';
      ctx.lineWidth = 2.2;
      if (prog > 0.92) {
        ctx.shadowColor = '#2DD4BF';
        ctx.shadowBlur = 16;
      }
      ctx.beginPath();
      ctx.arc(ex, ey, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    });
  }

  function loop(now) {
    const t = now * 0.001;
    updateActivityScale();
    drawHD1(t);
    drawHD2(t);
    drawHD3(t);
    drawHD4(t);
    drawBridges(t);
    if (!reduced) requestAnimationFrame(loop);
  }

  if (reduced) {
    loop(0);
  } else {
    requestAnimationFrame(loop);
  }
})();
