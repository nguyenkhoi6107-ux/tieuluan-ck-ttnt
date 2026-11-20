// Nội dung 3: radar 2D, mô phỏng 3D và phiếu báo cáo của trạm.
// Tọa độ lấy đúng theo giáo án (bước 1 của nội dung 3).

const QUY_DAO = [
  { ten: 'T1', diem: 'A', M: [2, -1, 3], u: [2, 1, -2], mau: '#f87171', nhan: 0.95 },
  { ten: 'V1', diem: 'B', M: [0, 2, 1], u: [-4, -2, 4], mau: '#60a5fa', nhan: 0.12 },
  { ten: 'V2', diem: 'C', M: [4, 0, 1], u: [-2, -1, 2], mau: '#c084fc', nhan: 0.92 },
  { ten: 'V3', diem: 'D', M: [5, 1, -2], u: [1, 0, 1], mau: '#4ade80', nhan: 0.97 },
  { ten: 'V4', diem: 'E', M: [5, 2, -2], u: [1, 0, 1], mau: '#fbbf24', nhan: 0.97 }
];
const CANH_BAO = [{ so: 1, x: 6, y: 1 }, { so: 2, x: 8, y: 2 }];
const VUNG = { x: [-4, 12], y: [-5, 6], z: [-8, 8] };
const VI_TRI = { 'trung': 'trùng nhau', 'song-song': 'song song', 'cat': 'cắt nhau', 'cheo': 'chéo nhau' };

/* ---------- Tính toán vectơ ---------- */

const tru = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const cong = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const nhan = (k, a) => [k * a[0], k * a[1], k * a[2]];
const vo = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const coHuong = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const laKhong = a => a.every(x => Math.abs(x) < 1e-9);
const diemTren = (q, t) => cong(q.M, nhan(t, q.u));
const timQuyDao = ten => QUY_DAO.find(q => q.ten === ten);

// Khoảng tham số để quỹ đạo nằm trong vùng vẽ, xét theo các trục được chọn.
function doanThamSo(q, cacTruc) {
  let lo = -Infinity, hi = Infinity;
  cacTruc.forEach(i => {
    const [a, b] = VUNG['xyz'[i]];
    if (q.u[i] === 0) {
      if (q.M[i] < a || q.M[i] > b) { lo = 1; hi = 0; }
      return;
    }
    let t1 = (a - q.M[i]) / q.u[i], t2 = (b - q.M[i]) / q.u[i];
    if (t1 > t2) [t1, t2] = [t2, t1];
    lo = Math.max(lo, t1);
    hi = Math.min(hi, t2);
  });
  return [lo, hi];
}

function giaoDiem(P, Q) {
  const d = tru(Q.M, P.M);
  for (const [i, j] of [[0, 1], [0, 2], [1, 2]]) {
    const det = P.u[i] * -Q.u[j] - P.u[j] * -Q.u[i];
    if (Math.abs(det) > 1e-9) {
      const t = (d[i] * -Q.u[j] - d[j] * -Q.u[i]) / det;
      return diemTren(P, t);
    }
  }
  return null;
}

// Xét vị trí tương đối của T1 với một vệ tinh theo quy trình hai bước.
function phanTich(tenVeTinh) {
  const T = QUY_DAO[0], V = timQuyDao(tenVeTinh);
  const c = coHuong(T.u, V.u);
  const AM = tru(V.M, T.M);
  const kq = { T, V, c, AM, cungPhuong: laKhong(c), tich: vo(c, AM) };
  if (kq.cungPhuong) {
    const i = T.u.findIndex(x => x !== 0);
    kq.k = V.u[i] / T.u[i];
    kq.thuoc = laKhong(coHuong(AM, T.u));
    kq.viTri = kq.thuoc ? 'trung' : 'song-song';
  } else {
    kq.viTri = Math.abs(kq.tich) < 1e-9 ? 'cat' : 'cheo';
    if (kq.viTri === 'cat') kq.giao = giaoDiem(T, V);
  }
  kq.coDiemChung = kq.viTri === 'trung' || kq.viTri === 'cat';
  return kq;
}

// Tại một điểm cảnh báo (x; y): độ cao z của T1 và của vệ tinh có hình chiếu đi qua điểm đó.
function xetCanhBao(cb) {
  const T = QUY_DAO[0];
  const zT = T.M[2] + T.u[2] * (cb.x - T.M[0]) / T.u[0];
  const veTinh = QUY_DAO.slice(1).filter(V => !phanTich(V.ten).cungPhuong && V.u[0] !== 0).map(V => {
    const s = (cb.x - V.M[0]) / V.u[0];
    return { V, y: V.M[1] + s * V.u[1], z: V.M[2] + s * V.u[2] };
  }).find(o => Math.abs(o.y - cb.y) < 1e-9);
  return { zT, veTinh, that: veTinh && Math.abs(veTinh.z - zT) < 1e-9 };
}

/* ---------- Viết số và biểu thức ---------- */

const so = x => (Math.abs(x - Math.round(x)) < 1e-9 ? String(Math.round(x)) : String(+x.toFixed(3)));
const toaDo = a => '(' + a.map(so).join(';') + ')';
const kLanU = k => (k === 1 ? '\\vec u' : k === -1 ? '-\\vec u' : so(k) + '\\vec u');
const chiSo = ten => ten.slice(1);

function bieuThucTich(c, AM) {
  return c.map((x, i) => x * AM[i])
    .map((x, i) => (i === 0 ? so(x) : x < 0 ? ' - ' + so(-x) : ' + ' + so(x)))
    .join('');
}

function giaiThichThuoc(kq) {
  const T = kq.T, P = kq.V.diem, i = T.u.findIndex(x => x !== 0);
  const t0 = kq.AM[i] / T.u[i];
  const Q = diemTren(T, t0);
  const ket = kq.thuoc
    ? `trùng với $${P}${toaDo(kq.V.M)}$, nên $${P} \\in$ T1`
    : `khác $${P}${toaDo(kq.V.M)}$, nên $${P} \\notin$ T1`;
  return `Thay $${'xyz'[i]} = ${so(kq.V.M[i])}$ vào phương trình của T1 được $t = ${so(t0)}$; khi đó T1 đi qua $${toaDo(Q)}$, ${ket}.`;
}

function loiGiai(kq) {
  const n = chiSo(kq.V.ten), P = kq.V.diem, ten = kq.V.ten;
  if (kq.viTri === 'song-song') return `${ten} song song với T1: $\\vec v_${n} = ${kLanU(kq.k)}$ và $${P} \\notin$ T1.`;
  if (kq.viTri === 'trung') return `${ten} trùng T1: $\\vec v_${n} = ${kLanU(kq.k)}$ và $${P} \\in$ T1.`;
  const bt = `$[\\vec u,\\vec v_${n}]\\cdot\\overrightarrow{A${P}} = ${bieuThucTich(kq.c, kq.AM)}`;
  if (kq.viTri === 'cat') return `${ten} cắt T1: ${bt} = 0$, hai quỹ đạo gặp nhau tại $${toaDo(kq.giao)}$.`;
  return `${ten} chéo T1: ${bt} = ${so(kq.tich)} \\ne 0$.`;
}

function loiGiaiCau3() {
  return CANH_BAO.map(cb => {
    const x = xetCanhBao(cb);
    const ten = x.veTinh.V.ten;
    if (x.that) {
      return `Cảnh báo tại $(${cb.x};${cb.y})$: T1 và ${ten} cắt nhau tại $(${cb.x};${cb.y};${so(x.zT)})$, đây là <b>báo động thật</b>.`;
    }
    return `Cảnh báo tại $(${cb.x};${cb.y})$: với $x = ${cb.x},\\ y = ${cb.y}$ thì T1 có $z = ${so(x.zT)}$ còn ${ten} có $z = ${so(x.veTinh.z)}$; hai quỹ đạo chéo nhau, đây là <b>báo động giả</b>.`;
  }).join('<br>');
}

function dapAnCau3() {
  const that = CANH_BAO.filter(cb => xetCanhBao(cb).that);
  if (that.length === 0) return { chon: 'khong', diem: null };
  if (that.length > 1) return { chon: 'ca-hai', diem: null };
  const cb = that[0];
  return { chon: String(cb.so), diem: [cb.x, cb.y, xetCanhBao(cb).zT] };
}

function docSo(s) {
  s = String(s || '').trim().replace(/[−–—]/g, '-').replace(',', '.').replace(/\s+/g, '');
  if (!/^[-+]?(\d+(\.\d*)?|\.\d+)(\/[-+]?\d+)?$/.test(s)) return null;
  if (s.includes('/')) {
    const [a, b] = s.split('/').map(Number);
    return b ? a / b : null;
  }
  return Number(s);
}
const bang = (a, b) => a !== null && Math.abs(a - b) < 1e-6;

/* ---------- Vẽ ---------- */

function chuanBiCanvas(cv, tiLe) {
  const dpr = window.devicePixelRatio || 1;
  const w = cv.clientWidth, h = Math.round(w * tiLe);
  cv.style.height = h + 'px';
  cv.width = Math.round(w * dpr);
  cv.height = Math.round(h * dpr);
  const ctx = cv.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, w, h };
}

function doanThang(ctx, x1, y1, x2, y2) {
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
}

// Viết nhãn; nếu tràn mép phải thì lùi sang bên trái điểm.
function vietNhan(ctx, chu, x, y, w) {
  const rong = ctx.measureText(chu).width;
  if (x + rong > w - 4) x = Math.max(4, x - rong - 16);
  ctx.fillText(chu, x, y);
}

const CHU = '12px "Be Vietnam Pro", system-ui, sans-serif';
const CHU_DAM = '600 13px "Be Vietnam Pro", system-ui, sans-serif';

// Radar: hình chiếu của các quỹ đạo lên mặt phẳng Oxy.
const cvRadar = document.getElementById('radar');
let R = null;

function veRadar(thoiGian) {
  if (!R) return;
  const { ctx, w, h } = R;
  ctx.clearRect(0, 0, w, h);
  const le = 26;
  const rx = VUNG.x[1] - VUNG.x[0], ry = VUNG.y[1] - VUNG.y[0];
  const s = Math.min((w - 2 * le) / rx, (h - 2 * le) / ry);
  const ox = (w - s * rx) / 2, oy = (h - s * ry) / 2;
  const X = x => ox + (x - VUNG.x[0]) * s;
  const Y = y => h - oy - (y - VUNG.y[0]) * s;

  ctx.lineWidth = 1;
  for (let x = VUNG.x[0]; x <= VUNG.x[1]; x++) {
    ctx.strokeStyle = x === 0 ? 'rgba(154,166,199,.6)' : 'rgba(79,209,197,.09)';
    doanThang(ctx, X(x), Y(VUNG.y[0]), X(x), Y(VUNG.y[1]));
  }
  for (let y = VUNG.y[0]; y <= VUNG.y[1]; y++) {
    ctx.strokeStyle = y === 0 ? 'rgba(154,166,199,.6)' : 'rgba(79,209,197,.09)';
    doanThang(ctx, X(VUNG.x[0]), Y(y), X(VUNG.x[1]), Y(y));
  }
  ctx.fillStyle = 'rgba(154,166,199,.75)';
  ctx.font = CHU;
  for (let x = VUNG.x[0]; x <= VUNG.x[1]; x += 2) if (x !== 0) ctx.fillText(x, X(x) - 4, Y(0) + 14);
  for (let y = VUNG.y[0] + 1; y <= VUNG.y[1]; y += 2) if (y !== 0) ctx.fillText(y, X(0) + 5, Y(y) + 4);
  ctx.fillText('O', X(0) - 13, Y(0) + 14);
  ctx.fillText('x', X(VUNG.x[1]) - 10, Y(0) - 6);
  ctx.fillText('y', X(0) + 6, Y(VUNG.y[1]) + 12);

  // tia quét
  const cx = X(4), cy = Y(0.5), banKinh = Math.hypot(w, h);
  const goc = (thoiGian / 1000) * 1.1;
  for (let i = 0; i < 24; i++) {
    ctx.strokeStyle = `rgba(79,209,197,${0.16 * (1 - i / 24)})`;
    const g = goc - i * 0.025;
    doanThang(ctx, cx, cy, cx + banKinh * Math.cos(g), cy - banKinh * Math.sin(g));
  }

  // quỹ đạo
  QUY_DAO.forEach(q => {
    const [a, b] = doanThamSo(q, [0, 1]);
    if (a > b) return;
    const p1 = diemTren(q, a), p2 = diemTren(q, b);
    ctx.strokeStyle = q.mau;
    ctx.lineWidth = 2.5;
    ctx.setLineDash(q.ten === 'V2' ? [10, 8] : []);
    doanThang(ctx, X(p1[0]), Y(p1[1]), X(p2[0]), Y(p2[1]));
    ctx.setLineDash([]);
    const pn = diemTren(q, a + (b - a) * q.nhan);
    ctx.fillStyle = q.mau;
    ctx.font = CHU_DAM;
    vietNhan(ctx, q.ten, X(pn[0]) + 6, Y(pn[1]) - 7, w);
  });

  // cảnh báo nhấp nháy
  const pha = (thoiGian / 1000) % 1;
  CANH_BAO.forEach(cb => {
    const px = X(cb.x), py = Y(cb.y);
    ctx.strokeStyle = `rgba(248,113,113,${1 - pha})`;
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(px, py, 6 + 14 * pha, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = '#f87171';
    ctx.beginPath(); ctx.arc(px, py, 4, 0, Math.PI * 2); ctx.fill();
    ctx.font = CHU_DAM;
    ctx.fillStyle = '#fecaca';
    vietNhan(ctx, `Cảnh báo (${cb.x}; ${cb.y})`, px + 8, py + 18, w);
  });
}

function lapRadar(t) {
  veRadar(t);
  requestAnimationFrame(lapRadar);
}

// Mô phỏng 3D: phép chiếu song song, xoay quanh trục z và nghiêng góc nhìn.
const cvKG = document.getElementById('khong-gian');
let K = null;
const KG = {
  goc: 0,
  nghieng: Math.PI / 2,
  hien: { T1: true, V1: true, V2: true, V3: true, V4: true },
  dong: false
};
const TAM = [4, 0.5, -0.5];

function chieu(p, w, h, s) {
  const x = p[0] - TAM[0], y = p[1] - TAM[1], z = p[2] - TAM[2];
  const c = Math.cos(KG.goc), sn = Math.sin(KG.goc);
  const x1 = x * c - y * sn, y1 = x * sn + y * c;
  const cp = Math.cos(KG.nghieng), sp = Math.sin(KG.nghieng);
  return [w / 2 + s * x1, h / 2 - s * (y1 * sp + z * cp), y1 * cp - z * sp];
}

function ve3D() {
  if (!K) return;
  const { ctx, w, h } = K;
  ctx.clearRect(0, 0, w, h);
  const s = Math.min(w / 20, h / 15);
  const P = p => chieu(p, w, h, s);

  // lưới mặt phẳng z = 0
  ctx.lineWidth = 1;
  ctx.strokeStyle = 'rgba(79,209,197,.08)';
  for (let x = VUNG.x[0]; x <= VUNG.x[1]; x++) {
    const a = P([x, VUNG.y[0], 0]), b = P([x, VUNG.y[1], 0]);
    doanThang(ctx, a[0], a[1], b[0], b[1]);
  }
  for (let y = VUNG.y[0]; y <= VUNG.y[1]; y++) {
    const a = P([VUNG.x[0], y, 0]), b = P([VUNG.x[1], y, 0]);
    doanThang(ctx, a[0], a[1], b[0], b[1]);
  }

  // trục tọa độ
  const O = P([0, 0, 0]);
  ctx.strokeStyle = 'rgba(154,166,199,.7)';
  ctx.fillStyle = 'rgba(154,166,199,.9)';
  ctx.lineWidth = 1.3;
  ctx.font = CHU_DAM;
  [[[12.5, 0, 0], 'x'], [[0, 6.5, 0], 'y'], [[0, 0, 7], 'z']].forEach(([dau, ten]) => {
    const p = P(dau);
    doanThang(ctx, O[0], O[1], p[0], p[1]);
    ctx.fillText(ten, p[0] + 5, p[1] - 5);
  });
  ctx.fillText('O', O[0] - 14, O[1] + 14);

  // quỹ đạo: chia nhỏ thành đoạn, vẽ đoạn xa trước, đoạn gần sau
  const doan = [];
  QUY_DAO.forEach(q => {
    if (!KG.hien[q.ten]) return;
    const [a, b] = doanThamSo(q, [0, 1, 2]);
    if (a > b) return;
    const N = 60;
    for (let i = 0; i < N; i++) {
      const p0 = P(diemTren(q, a + (b - a) * i / N));
      const p1 = P(diemTren(q, a + (b - a) * (i + 1) / N));
      doan.push({ q, i, p0, p1, d: (p0[2] + p1[2]) / 2 });
    }
  });
  if (doan.length) {
    const dMin = Math.min(...doan.map(o => o.d)), dMax = Math.max(...doan.map(o => o.d));
    doan.sort((m, n) => n.d - m.d);
    ctx.lineCap = 'round';
    doan.forEach(o => {
      if (o.q.ten === 'V2' && o.i % 2 === 1) return; // V2 trùng T1 nên vẽ nét đứt để vẫn thấy T1
      ctx.globalAlpha = 1 - 0.5 * (o.d - dMin) / ((dMax - dMin) || 1);
      ctx.strokeStyle = o.q.mau;
      ctx.lineWidth = 3;
      doanThang(ctx, o.p0[0], o.p0[1], o.p1[0], o.p1[1]);
    });
    ctx.globalAlpha = 1;
    ctx.lineCap = 'butt';
  }

  // điểm đi qua và tên quỹ đạo
  QUY_DAO.forEach(q => {
    if (!KG.hien[q.ten]) return;
    const p = P(q.M);
    ctx.fillStyle = q.mau;
    ctx.beginPath(); ctx.arc(p[0], p[1], 3.5, 0, Math.PI * 2); ctx.fill();
    ctx.font = CHU;
    ctx.fillText(q.diem, p[0] + 5, p[1] + 14);
    const [a, b] = doanThamSo(q, [0, 1, 2]);
    const pn = P(diemTren(q, a + (b - a) * q.nhan));
    ctx.font = CHU_DAM;
    vietNhan(ctx, q.ten, pn[0] + 6, pn[1] - 7, w);
  });

  // đường dóng thẳng đứng qua hai điểm cảnh báo
  if (KG.dong) {
    CANH_BAO.forEach(cb => {
      const a = P([cb.x, cb.y, -6]), b = P([cb.x, cb.y, 5]);
      ctx.strokeStyle = 'rgba(232,236,247,.55)';
      ctx.lineWidth = 1.2;
      ctx.setLineDash([5, 5]);
      doanThang(ctx, a[0], a[1], b[0], b[1]);
      ctx.setLineDash([]);
      const daVe = [];
      QUY_DAO.forEach(q => {
        if (!KG.hien[q.ten] || q.u[0] === 0) return;
        const t = (cb.x - q.M[0]) / q.u[0];
        const p = diemTren(q, t);
        if (Math.abs(p[1] - cb.y) > 1e-9 || daVe.some(z => Math.abs(z - p[2]) < 1e-9)) return;
        daVe.push(p[2]);
        const m = P(p);
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(m[0], m[1], 4.5, 0, Math.PI * 2); ctx.fill();
        ctx.font = CHU_DAM;
        vietNhan(ctx, `(${cb.x}; ${cb.y}; ${so(p[2])})`, m[0] + 8, m[1] + 4, w);
      });
    });
  }
}

function xoayToi(goc, nghieng) {
  const g0 = KG.goc, n0 = KG.nghieng, t0 = performance.now();
  function buoc(t) {
    const k = Math.min(1, (t - t0) / 500);
    const e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
    KG.goc = g0 + (goc - g0) * e;
    KG.nghieng = n0 + (nghieng - n0) * e;
    ve3D();
    if (k < 1) requestAnimationFrame(buoc);
  }
  requestAnimationFrame(buoc);
}

function datKichThuoc() {
  R = chuanBiCanvas(cvRadar, 0.72);
  K = chuanBiCanvas(cvKG, 0.72);
  ve3D();
}

function ganDieuKhienMoPhong() {
  const hop = document.getElementById('bat-tat');
  QUY_DAO.forEach(q => {
    const nut = document.createElement('button');
    nut.className = 'nut nho bat';
    nut.innerHTML = `<span class="cham" style="background:${q.mau}"></span>${q.ten}`;
    nut.addEventListener('click', () => {
      KG.hien[q.ten] = !KG.hien[q.ten];
      nut.classList.toggle('bat', KG.hien[q.ten]);
      ve3D();
    });
    hop.appendChild(nut);
  });
  document.getElementById('goc-tren').addEventListener('click', () => xoayToi(0, Math.PI / 2));
  document.getElementById('goc-nghieng').addEventListener('click', () => xoayToi(0.6, 0.45));
  const nutDong = document.getElementById('duong-dong');
  nutDong.addEventListener('click', () => {
    KG.dong = !KG.dong;
    nutDong.classList.toggle('bat', KG.dong);
    ve3D();
  });

  let keo = null;
  cvKG.addEventListener('pointerdown', e => {
    keo = { x: e.clientX, y: e.clientY };
    cvKG.setPointerCapture(e.pointerId);
  });
  cvKG.addEventListener('pointermove', e => {
    if (!keo) return;
    KG.goc += (e.clientX - keo.x) * 0.008;
    KG.nghieng = Math.min(Math.PI / 2, Math.max(-0.2, KG.nghieng + (e.clientY - keo.y) * 0.008));
    keo = { x: e.clientX, y: e.clientY };
    ve3D();
  });
  const tha = () => { keo = null; };
  cvKG.addEventListener('pointerup', tha);
  cvKG.addEventListener('pointercancel', tha);

  let hen = null;
  window.addEventListener('resize', () => {
    clearTimeout(hen);
    hen = setTimeout(datKichThuoc, 150);
  });
}

/* ---------- Phiếu báo cáo của trạm ---------- */

const KHOA_MAY = 'tkv-noi-dung-3';
const MAC_DINH = { tram: '', veTinh: '', c1: null, c2: null, c3: null, cuuHo: false, tangToc: null };
let TT = Object.assign({}, MAC_DINH, docMay(KHOA_MAY, {}));
const $ = id => document.getElementById(id);
const luu = () => luuMay(KHOA_MAY, TT);

function chonRadio(ten, giaTri) {
  document.querySelectorAll(`input[name="${ten}"]`).forEach(o => { o.checked = o.value === giaTri; });
}
function layRadio(ten) {
  const o = document.querySelector(`input[name="${ten}"]:checked`);
  return o ? o.value : '';
}
function khoaCau(so, khoa) {
  const hop = $('cau-' + so);
  hop.style.opacity = khoa ? 0.55 : 1;
  hop.querySelectorAll('input, button').forEach(o => { o.disabled = khoa; });
}
function hienPhanHoi(id, dung, html) {
  const el = $(id);
  el.className = 'phan-hoi ' + (dung ? 'dung' : 'sai');
  el.innerHTML = html;
  el.hidden = false;
  veToan(el);
}
function nhacDien(id, chu) {
  const el = $(id);
  el.className = 'phan-hoi sai';
  el.textContent = chu;
  el.hidden = false;
}
const tongDiem = () => ['c1', 'c2', 'c3'].reduce((t, c) => t + (TT[c] ? TT[c].diem : 0), 0);
const conTangToc = () => TT.tangToc && Date.now() - TT.tangToc <= 60000;

function nhanNhiemVu() {
  const tram = $('chon-tram').value, veTinh = $('chon-ve-tinh').value;
  if (!tram || !veTinh) {
    alertNhe('Chọn đủ số trạm và vệ tinh.');
    return;
  }
  TT.tram = tram;
  TT.veTinh = veTinh;
  luu();
  capNhat();
}

function alertNhe(chu) {
  let el = $('nhac-nhan');
  if (!el) {
    el = document.createElement('p');
    el.id = 'nhac-nhan';
    el.className = 'phan-hoi sai';
    $('buoc-nhan').appendChild(el);
  }
  el.textContent = chu;
}

function nopCau1() {
  const tl = layRadio('c1');
  if (!tl) return nhacDien('ph-1', 'Chọn một dự đoán trước khi nộp.');
  const kq = phanTich(TT.veTinh);
  const dung = tl === (kq.coDiemChung ? 'co' : 'khong');
  TT.c1 = { tl, dung, diem: dung ? 10 : 0 };
  luu();
  capNhat();
}

function nopCau2() {
  const tl = {
    cp: layRadio('c2-cp'),
    k: $('c2-k').value,
    thuoc: layRadio('c2-thuoc'),
    tich: $('c2-tich').value,
    vt: layRadio('c2-vt')
  };
  if (!tl.cp || !tl.vt) return nhacDien('ph-2', 'Làm đủ bước a và phần kết luận trước khi nộp.');
  if (tl.cp === 'co' && (docSo(tl.k) === null || !tl.thuoc)) return nhacDien('ph-2', 'Điền số k và trả lời bước c trước khi nộp.');
  if (tl.cp === 'khong' && docSo(tl.tich) === null) return nhacDien('ph-2', 'Điền giá trị của tích ở bước b trước khi nộp.');
  const loi = chamCau2(tl, phanTich(TT.veTinh));
  TT.c2 = Object.assign(tl, { dung: loi.length === 0, diem: loi.length === 0 ? 20 : 0 });
  luu();
  capNhat();
}

function chamCau2(tl, kq) {
  const loi = [];
  if ((tl.cp === 'co') !== kq.cungPhuong) {
    loi.push(kq.cungPhuong
      ? `Bước a chưa đúng: $\\vec v = ${kLanU(kq.k)}$ nên hai vectơ chỉ phương cùng phương. Khi đó $[\\vec u,\\vec v] = \\vec 0$, tích $[\\vec u,\\vec v]\\cdot\\overrightarrow{AM}$ luôn bằng $0$, không dùng tích này để kết luận được.`
      : 'Bước a chưa đúng: các tọa độ của $\\vec v$ và $\\vec u$ không tỉ lệ, không có số $k$ nào để $\\vec v = k\\vec u$, nên hai vectơ chỉ phương không cùng phương.');
  } else if (kq.cungPhuong) {
    if (!bang(docSo(tl.k), kq.k)) loi.push(`Bước b chưa đúng: $\\vec v = ${kLanU(kq.k)}$, tức $k = ${so(kq.k)}$.`);
    if ((tl.thuoc === 'co') !== kq.thuoc) loi.push('Bước c chưa đúng. ' + giaiThichThuoc(kq));
  } else if (!bang(docSo(tl.tich), kq.tich)) {
    loi.push(`Bước b chưa đúng: $[\\vec u,\\vec v] = ${toaDo(kq.c)}$, $\\overrightarrow{A${kq.V.diem}} = ${toaDo(kq.AM)}$, tích bằng $${bieuThucTich(kq.c, kq.AM)} = ${so(kq.tich)}$.`);
  }
  if (tl.vt !== kq.viTri) loi.push(`Kết luận chưa đúng: T1 và ${kq.V.ten} ${VI_TRI[kq.viTri]}.`);
  return loi;
}

function nopCau3() {
  const tl = { cb: layRadio('c3'), x: $('c3-x').value, y: $('c3-y').value, z: $('c3-z').value };
  if (!tl.cb) return nhacDien('ph-3', 'Chọn một phương án trước khi nộp.');
  const da = dapAnCau3();
  let dung = tl.cb === da.chon;
  if (dung && da.diem) dung = da.diem.every((v, i) => bang(docSo([tl.x, tl.y, tl.z][i]), v));
  const nhanDoi = dung && conTangToc();
  TT.c3 = Object.assign(tl, { dung, nhanDoi, diem: dung ? (nhanDoi ? 80 : 40) : 0 });
  luu();
  capNhat();
}

function dungTheCuuHo() {
  if (TT.cuuHo) return;
  TT.cuuHo = true;
  luu();
  capNhat();
}

function dungTheTangToc() {
  if (TT.tangToc || !TT.c2 || TT.c3) return;
  TT.tangToc = Date.now();
  luu();
  capNhat();
}

function capNhatDongHo() {
  const el = $('dem-tang-toc');
  if (!TT.tangToc) { el.textContent = ''; return; }
  if (TT.c3) { el.textContent = TT.c3.nhanDoi ? '· Tăng tốc: nhân đôi' : '· Tăng tốc: không đạt'; return; }
  const con = 60 - (Date.now() - TT.tangToc) / 1000;
  el.textContent = con > 0 ? '· Tăng tốc ' + dinhDangGiay(con) : '· Tăng tốc: hết 60 giây';
}

function capNhatNhan() {
  const V = timQuyDao(TT.veTinh);
  if (!V) return;
  $('ten-diem-ve-tinh').innerHTML = `$${V.diem}$`;
  $('nhan-tich').innerHTML = `$[\\vec u,\\vec v]\\cdot\\overrightarrow{A${V.diem}}$`;
  veToan($('ten-diem-ve-tinh'));
  veToan($('nhan-tich'));
}

function hienNhanh() {
  const cp = layRadio('c2-cp');
  $('nhanh-cung-phuong').hidden = cp !== 'co';
  $('nhanh-khong-cung-phuong').hidden = cp !== 'khong';
}

function capNhat() {
  const daNhan = TT.tram && TT.veTinh;
  $('buoc-nhan').hidden = !!daNhan;
  $('nhiem-vu').hidden = !daNhan;
  if (!daNhan) return;

  $('dang-lam').textContent = `Trạm ${TT.tram} · Vệ tinh ${TT.veTinh} · xét vị trí tương đối của T1 và ${TT.veTinh}`;
  capNhatNhan();
  const kq = phanTich(TT.veTinh);

  // Câu 1
  if (TT.c1) {
    chonRadio('c1', TT.c1.tl);
    hienPhanHoi('ph-1', TT.c1.dung, TT.c1.dung
      ? 'Dự đoán đúng · +10 RP. Câu 2: chứng minh bằng tính toán.'
      : 'Dự đoán chưa đúng · +0 RP. Xoay mô phỏng sang nhiều góc nhìn khác nhau rồi kiểm tra lại bằng tính toán ở câu 2.');
  }
  khoaCau(1, !!TT.c1);

  // Câu 2
  if (TT.c2) {
    chonRadio('c2-cp', TT.c2.cp);
    $('c2-k').value = TT.c2.k || '';
    chonRadio('c2-thuoc', TT.c2.thuoc);
    $('c2-tich').value = TT.c2.tich || '';
    chonRadio('c2-vt', TT.c2.vt);
    const loi = chamCau2(TT.c2, kq);
    hienPhanHoi('ph-2', TT.c2.dung, (TT.c2.dung ? 'Chính xác · +20 RP. ' : loi.join('<br>') + '<br><b>Lời giải:</b> ') + loiGiai(kq));
  }
  hienNhanh();
  khoaCau(2, !TT.c1 || !!TT.c2);

  // Câu 3
  if (TT.c3) {
    chonRadio('c3', TT.c3.cb);
    $('c3-x').value = TT.c3.x;
    $('c3-y').value = TT.c3.y;
    $('c3-z').value = TT.c3.z;
    const dau = TT.c3.dung
      ? `Chính xác · +${TT.c3.diem} RP${TT.c3.nhanDoi ? ' (thẻ Tăng tốc nhân đôi)' : ''}.<br>`
      : 'Chưa đúng · +0 RP.<br>';
    hienPhanHoi('ph-3', TT.c3.dung, dau + loiGiaiCau3());
  }
  khoaCau(3, !TT.c2 || !!TT.c3);

  // Thẻ kỹ năng
  $('the-cuu-ho').disabled = TT.cuuHo;
  $('the-cuu-ho').textContent = TT.cuuHo ? 'Đã dùng thẻ Cứu hộ' : 'Thẻ Cứu hộ chuyên môn';
  $('the-tang-toc').disabled = !!TT.tangToc || !TT.c2 || !!TT.c3;
  $('the-tang-toc').textContent = TT.tangToc ? 'Đã dùng thẻ Tăng tốc' : 'Thẻ Tăng tốc';
  const ghiChu = [];
  if (TT.cuuHo) ghiChu.push('Thẻ Cứu hộ: giơ tay mời giáo viên tới trạm gợi ý một bước, không bị trừ điểm.');
  if (!TT.tangToc && !TT.c3) ghiChu.push('Thẻ Tăng tốc dùng cho câu 3: bật thẻ rồi giải đúng trong 60 giây thì điểm câu 3 nhân đôi.');
  if (!TT.cuuHo) ghiChu.push('Mỗi thẻ chỉ dùng một lần.');
  $('ghi-chu-the').textContent = ghiChu.join(' ');
  capNhatDongHo();

  $('tong-rp').textContent = tongDiem() + ' RP';
  veBaoCao(kq);
}

function veBaoCao(kq) {
  const bc = $('bao-cao');
  if (!TT.c1) { bc.hidden = true; return; }
  const dong = [`Trạm ${TT.tram} · Vệ tinh ${TT.veTinh}`];
  const dg = c => (c.dung ? 'đúng' : 'sai') + ` · +${c.diem} RP`;
  dong.push(`Câu 1, dự đoán: ${TT.c1.tl === 'co' ? 'có điểm chung' : 'không có điểm chung'} (${dg(TT.c1)})`);
  if (TT.c2) dong.push(`Câu 2, kết luận: T1 và ${TT.veTinh} ${VI_TRI[TT.c2.vt]} (${dg(TT.c2)})`);
  if (TT.c3) {
    const chon = { '1': 'cảnh báo tại (6; 1) là thật', '2': 'cảnh báo tại (8; 2) là thật', 'ca-hai': 'cả hai cảnh báo là thật', 'khong': 'không cảnh báo nào là thật' }[TT.c3.cb];
    const diem = [TT.c3.x, TT.c3.y, TT.c3.z].some(v => String(v).trim()) ? `, điểm nguy hiểm (${TT.c3.x}; ${TT.c3.y}; ${TT.c3.z})` : '';
    dong.push(`Câu 3: ${chon}${diem} (${dg(TT.c3)})`);
  }
  dong.push(`<b>Tổng: ${tongDiem()} RP</b>`);
  $('noi-dung-bao-cao').innerHTML = dong.join('<br>');
  bc.hidden = false;
}

function ganPhieu() {
  if (TT.tram) $('chon-tram').value = TT.tram;
  if (TT.veTinh) $('chon-ve-tinh').value = TT.veTinh;
  $('nhan-nhiem-vu').addEventListener('click', nhanNhiemVu);
  $('nop-1').addEventListener('click', nopCau1);
  $('nop-2').addEventListener('click', nopCau2);
  $('nop-3').addEventListener('click', nopCau3);
  $('the-cuu-ho').addEventListener('click', dungTheCuuHo);
  $('the-tang-toc').addEventListener('click', dungTheTangToc);
  document.querySelectorAll('input[name="c2-cp"]').forEach(o => o.addEventListener('change', hienNhanh));

  const nutXoa = $('xoa-phieu');
  let choXoa = null;
  nutXoa.addEventListener('click', () => {
    if (!choXoa) {
      nutXoa.textContent = 'Bấm lần nữa để xoá';
      choXoa = setTimeout(() => { nutXoa.textContent = 'Xoá phiếu trên máy này'; choXoa = null; }, 3000);
      return;
    }
    clearTimeout(choXoa);
    choXoa = null;
    nutXoa.textContent = 'Xoá phiếu trên máy này';
    TT = Object.assign({}, MAC_DINH);
    luu();
    document.querySelectorAll('#phieu input[type=radio]').forEach(o => { o.checked = false; });
    document.querySelectorAll('#phieu input[type=text]').forEach(o => { o.value = ''; });
    ['ph-1', 'ph-2', 'ph-3'].forEach(id => { $(id).hidden = true; });
    $('chon-tram').value = '';
    $('chon-ve-tinh').value = '';
    capNhat();
  });

  setInterval(() => { if (TT.tangToc && !TT.c3) capNhatDongHo(); }, 250);
  capNhat();
}

document.addEventListener('DOMContentLoaded', () => {
  datKichThuoc();
  ganDieuKhienMoPhong();
  requestAnimationFrame(lapRadar);
  ganPhieu();
});
