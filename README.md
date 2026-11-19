# Trạm kiểm soát vũ trụ – Bài 15 Toán 12 (KNTT)

Web bài giảng của nhóm, môn Trí tuệ nhân tạo trong giáo dục.

Xem web: https://nguyenkhoi6107-ux.github.io/tieuluan-ck-ttnt/

| Thư mục | Hoạt động |
|---|---|
| (gốc) `index.html` | Trang chủ |
| `khoi-dong/` | 1. Khởi động: video, hai câu hỏi, nhiệm vụ của trạm và luật tính điểm |
| `noi-dung-1-2/` | 2. Nội dung 1 và 2: vectơ chỉ phương, phương trình tham số, chính tắc, Ví dụ 1–2, Luyện tập 1 |
| `noi-dung-3/` | 3. Báo động thật hay giả?: radar, mô phỏng 3D, phiếu báo cáo của trạm (`tram.js`) |
| `luyen-tap/` | 4. Luyện tập: game, hướng dẫn và bài tập về nhà |
| `giao-vien/` | Màn hình giáo viên: bảng RP, đồng hồ, đáp án nội dung 3 |
| `assets/` | `style.css` (giao diện chung), `chung.js` (hàm dùng chung) |

Quy ước: ai phụ trách thư mục nào thì chỉ sửa thư mục đó.

## Còn phải bổ sung

- Video khởi động: đặt file `video.mp4` vào thư mục `khoi-dong/` (GitHub web chỉ nhận file dưới 25 MB).
- Game luyện tập: dán đường dẫn game vào `href` của nút "Vào game" trong `luyen-tap/index.html`.

## Lưu ý khi sửa

- Link luôn dùng đường dẫn tương đối (`../assets/style.css`), không dùng `/assets/...`.
- Tọa độ T1 và V1–V4 nằm ở đầu file `noi-dung-3/tram.js`; đổi số liệu thì đổi ở đó, phần chấm điểm tự tính lại.
- Upload bằng web GitHub: kéo thả cả thư mục, đừng chọn file lẻ bằng "choose your files" (sẽ mất thư mục, các file `index.html` đè lên nhau).
