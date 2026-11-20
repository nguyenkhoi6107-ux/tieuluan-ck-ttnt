# Trạm kiểm soát vũ trụ – Bài 15 Toán 12 (KNTT)

Web bài giảng của nhóm, môn Trí tuệ nhân tạo trong giáo dục.

Mỗi thư mục là một trang. File `index.html` trong thư mục là trang được mở.

| Thư mục | Hoạt động |
|---|---|
| (gốc) `index.html` | Trang chủ |
| `khoi-dong/` | Khởi động: tình huống bản vẽ (mô hình xoay được), hai câu hỏi, nhiệm vụ của trạm |
| `noi-dung-1-2/` | Hình thành kiến thức, nội dung 1 và 2 |
| `noi-dung-3/` | Nội dung 3: Báo động thật hay giả? |
| `luyen-tap/` | Luyện tập: game Foxy Running (`index.html` học sinh vào phòng, `teacher.html` giáo viên tạo phòng, `play.html?mode=solo` chơi một mình) |
| `ve-nha/` | Hướng dẫn và bài tập về nhà |
| `giao-vien/` | Màn hình giáo viên: tạo phòng game, bảng RP, đồng hồ, đáp án nội dung 3 |
| `assets/style.css` | Giao diện chung, hiệu ứng trang chủ |
| `assets/noi-dung.css`, `assets/chung.js` | Giao diện và hàm dùng chung cho phần nội dung bên trong các hoạt động |
| `noi-dung-3/tram.js` | Radar, mô phỏng 3D, phiếu báo cáo của trạm; tọa độ T1, V1–V4 ở đầu file |

Quy ước: ai phụ trách thư mục nào thì chỉ sửa thư mục đó.

Trước khi đẩy lên GitHub: tải bản mới nhất về trước, chỉ sửa phần của mình, không xoá file của người khác.

## Thiết kế lại giao diện mà không làm hỏng chức năng

Nội dung và hoạt động của các trang đã đủ. Khi đổi giao diện (như đã làm với `khoi-dong/` và `noi-dung-1-2/`), được thay khung, màu, bố cục, hiệu ứng, nhưng **giữ nguyên** những thứ dưới đây, vì script tìm đúng tên này để chạy.

Chung cho mọi trang:
- Công thức viết trong `$...$` và `$$...$$`, giữ hai thẻ KaTeX và `assets/chung.js`.
- Nút có `data-hien="<id>"` mở/đóng khối có `id` đó (khối để `hidden`). Nút có `data-dem` là đồng hồ đếm.
- Trong CSS giữ dòng `.katex svg { max-width: none; }`, thiếu dòng này là mất mũi tên vectơ.

`noi-dung-3/` (đi kèm `tram.js`):
- Hình vẽ: `radar`, `khong-gian`; nút `goc-tren`, `goc-nghieng`, `duong-dong`, `bat-tat`.
- Chọn trạm và nhận nhiệm vụ: `chon-tram`, `chon-ve-tinh`, `nhan-nhiem-vu`, `nhiem-vu`, `ten-diem-ve-tinh`, `dang-lam`, `buoc-nhan`, `nhac-nhan`.
- Phiếu: khối `phieu` chứa `cau-1`, `cau-2`, `cau-3`, `ph-1`, `ph-2`, `ph-3`; ô `c2-k`, `c2-tich`, `c3-x`, `c3-y`, `c3-z`; nhóm chọn `name="c1"`, `c2-cp`, `c2-thuoc`, `c2-vt`, `c3`; nhánh `nhanh-cung-phuong`, `nhanh-khong-cung-phuong`, `nhan-tich`; nút `nop-1`, `nop-2`, `nop-3`, `xoa-phieu`.
- Điểm và thẻ: `tong-rp`, `the-cuu-ho`, `the-tang-toc`, `dem-tang-toc`, `ghi-chu-the`, `bao-cao`, `noi-dung-bao-cao`.
- Thứ tự trang: tình huống, `mo-phong`, `kien-thuc` (có Ví dụ 3 `vd3`), `phieu`, `ket-luan-nd3` (kết luận `nd3-ket-luan` để ẩn tới cuối giờ). Kiến thức phải đứng trước phiếu.

`giao-vien/`: `bang-rp`, `them-tram`, `bot-tram`, `xoa-diem`, nút `data-cong`, `data-the`; đồng hồ `so-dong-ho`, `chay-dong-ho`, `dat-lai-dong-ho`, `moc-gio`, nút `data-giay`; đáp án `dap-an`.

`ve-nha/`: khối `bai-tap`; mỗi câu giữ `data-dung` (đáp án đúng).

Đổi xong thì mở trang, bấm thử hết các nút, làm thử một phiếu ở nội dung 3 trước khi đẩy lên.
