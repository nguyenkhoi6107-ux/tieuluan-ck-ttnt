// Hàm dùng chung cho các trang: lưu trên máy, hiện công thức, nút ẩn/hiện, đồng hồ.

const CONG_THUC = {
  delimiters: [
    { left: '$$', right: '$$', display: true },
    { left: '$', right: '$', display: false }
  ],
  throwOnError: false
};

function veToan(el) {
  if (window.renderMathInElement) renderMathInElement(el || document.body, CONG_THUC);
}

function docMay(khoa, macDinh) {
  try {
    const s = localStorage.getItem(khoa);
    return s ? JSON.parse(s) : macDinh;
  } catch (e) { return macDinh; }
}

function luuMay(khoa, giaTri) {
  try { localStorage.setItem(khoa, JSON.stringify(giaTri)); } catch (e) {}
}

function dinhDangGiay(s) {
  s = Math.max(0, Math.ceil(s));
  return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
}

// Nút có data-hien="id": bấm để hiện/ẩn phần tử có id đó.
function ganNutHien() {
  document.querySelectorAll('[data-hien]').forEach(nut => {
    const muc = document.getElementById(nut.dataset.hien);
    if (!muc) return;
    const chuGoc = nut.textContent;
    nut.addEventListener('click', () => {
      muc.hidden = !muc.hidden;
      nut.textContent = muc.hidden ? chuGoc : 'Ẩn đi';
    });
  });
}

// Nút có data-dem="60": đếm ngược, hiện số giây ngay trên nút.
function ganNutDem() {
  document.querySelectorAll('[data-dem]').forEach(nut => {
    const chuGoc = nut.textContent;
    let hen = null;
    nut.addEventListener('click', () => {
      if (hen) { clearInterval(hen); hen = null; nut.textContent = chuGoc; return; }
      let con = Number(nut.dataset.dem);
      const ketThuc = Date.now() + con * 1000;
      nut.textContent = dinhDangGiay(con);
      hen = setInterval(() => {
        con = (ketThuc - Date.now()) / 1000;
        if (con <= 0) { clearInterval(hen); hen = null; nut.textContent = 'Hết giờ'; return; }
        nut.textContent = dinhDangGiay(con);
      }, 250);
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  veToan(document.body);
  ganNutHien();
  ganNutDem();
});
