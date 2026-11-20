# Kịch bản Hoạt động 3 · Thử thách: Báo động thật hay giả?

Thời lượng 13 phút, gồm **Nội dung 3** (nhận biết vị trí tương đối, 5 phút) và **Nội dung 4** (vận dụng, 8 phút).

Mạch của cả hoạt động: radar báo hai cảnh báo → nhìn mô phỏng 3D thấy chưa chắc → học điều kiện → từng trạm tính cho vệ tinh của mình → giáo viên kết luận cảnh báo nào thật.

Trang hiện có đủ nội dung theo đúng thứ tự dưới đây. Khi thiết kế lại thì giữ thứ tự màn và các id ghi trong README.

---

## Nội dung 3 · Nhận biết vị trí tương đối (5 phút)

### Màn 1 · Tình huống (Bước 1, 1 phút)
- Radar của trung tâm báo **hai cảnh báo va chạm** tại (6; 1) và (8; 2). Radar chỉ đo được x, y nên chưa chắc cả hai đều đúng.
- Bảng 5 quỹ đạo:

| Quỹ đạo | Đi qua | Vectơ chỉ phương |
|---|---|---|
| Thiên thạch T1 | A(2; −1; 3) | u = (2; 1; −2) |
| Vệ tinh V1 | B(0; 2; 1) | v₁ = (−4; −2; 4) |
| Vệ tinh V2 | C(4; 0; 1) | v₂ = (2; 1; −2) |
| Vệ tinh V3 | D(4; 1; −3) | v₃ = (1; 0; 1) |
| Vệ tinh V4 | E(5; 2; −2) | v₄ = (1; 0; 1) |

- Luật chuyển động: mỗi vật xuất phát lúc t = 0, vectơ chỉ phương là **hướng và vận tốc**. Hai vật chỉ va chạm khi ở cùng một điểm **tại cùng một thời điểm**.
- Câu hỏi treo: hai cảnh báo có thật không?

### Màn 2 · Radar và mô phỏng 3D (Bước 2–3, 2 phút)
- Trái: radar 2D (`radar`). Phải: mô phỏng 3D kéo để xoay (`khong-gian`).
- Dưới: hàng nút bật/tắt từng quỹ đạo (`bat-tat`), nút góc nhìn trên xuống, góc nghiêng, đường dóng.
- Giáo viên xoay từ trên xuống (giống radar) sang góc nghiêng. Học sinh gọi tên các vị trí tương đối thấy được.
- Thông điệp của màn: nhìn từ trên xuống thì V3 và V4 đều như cắt T1, nghiêng ra mới khác. **Nhìn bằng mắt chưa đủ, cần điều kiện bằng tọa độ.**

### Màn 3 · Kiến thức (Bước 4, 2 phút)
- Bảng 4 vị trí tương đối (trùng, song song, cắt, chéo) với số điểm chung và điều kiện.
- Khung chốt: quy trình hai bước.
- Hai ghi chú: vì sao phải làm bước 1 trước; ý nghĩa của điều kiện tích hỗn tạp bằng 0.
- Ví dụ 3, lời giải ẩn sau nút "Xem lời giải".
- Màn này nên giống khung "chốt kiến thức" của Hoạt động 2 để học sinh nhận ra đây là phần phải ghi vở.

---

## Nội dung 4 · Vận dụng: báo động thật hay giả? (8 phút)

### Màn 4 · Nhận nhiệm vụ (Bước 1, 1 phút)
- Chọn số trạm, chọn vệ tinh được giao, bấm "Nhận nhiệm vụ". Bấm xong thì khối phiếu (`nhiem-vu`) mới hiện.

### Màn 5 · Phiếu báo cáo của trạm (Bước 2, 4 phút)
- Thanh trên cùng: thẻ Cứu hộ chuyên môn, thẻ Tăng tốc, điểm RP của trạm.
- **Câu 1 · Nhận biết (+10):** xoay mô phỏng, dự đoán có điểm chung không.
- **Câu 2 · Thông hiểu (+20):** hai vectơ chỉ phương có cùng phương không. Trang rẽ hai nhánh: cùng phương thì nhập k và chọn điểm có thuộc T1 không; không cùng phương thì nhập giá trị tích. Sau đó chọn kết luận trong 4 vị trí.
- **Câu 3 · Vận dụng (+40):** cảnh báo nào là báo động thật, và tọa độ điểm nguy hiểm (x; y; z). Có đồng hồ 60 giây khi dùng thẻ Tăng tốc.
- Mỗi câu nộp xong hiện phản hồi đúng/sai và lời giải ngay dưới câu.
- Cuối phiếu: khối "Báo cáo về trụ sở" tự tổng hợp 3 câu và tổng RP.

### Màn 6 · Trạm báo cáo (Bước 3, 2 phút)
- Không cần màn riêng. Trạm đọc khối "Báo cáo về trụ sở"; giáo viên cộng điểm trên trang giáo viên.

### Màn 7 · Kết luận (Bước 4, 1 phút)
- Nút "Hiện kết luận" (giáo viên bấm) mở bảng V1–V4:
  - V1 song song với T1, không va chạm.
  - V2 trùng T1 nhưng cùng vận tốc, luôn đi trước T1 một vectơ u, không va chạm.
  - V3 cắt T1 tại (6; 1; −1), cả hai cùng tới đó lúc t = 2: **báo động thật**.
  - V4 chéo T1; tại x = 8, y = 2 thì T1 có z = −3, V4 có z = 1: **báo động giả**.
- Mở rộng: T1 vuông góc với cả V3 và V4, vuông góc không phải vị trí tương đối thứ năm.
- Lúc này giáo viên cần quay lại mô phỏng để bật đường dóng. Nên có một nút "Xem lại mô phỏng" nhảy về `mo-phong`.

---

## Đáp án để bấm thử sau khi thiết kế lại

| Vệ tinh | Câu 1 | Câu 2 | Câu 3 |
|---|---|---|---|
| V1 | Không có điểm chung | Cùng phương, k = −2, không thuộc, song song | Cảnh báo (6; 1), điểm (6; 1; −1) |
| V2 | Có điểm chung | Cùng phương, k = 1, thuộc, trùng nhau | như trên |
| V3 | Có điểm chung | Không cùng phương, tích = 0, cắt nhau | như trên |
| V4 | Không có điểm chung | Không cùng phương, tích = −4, chéo nhau | như trên |

Làm đúng cả 3 câu thì trạm được 70 RP.
