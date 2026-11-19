# Trạm kiểm soát vũ trụ – Bài 15 Toán 12 (KNTT)

Web bài giảng của nhóm, môn Trí tuệ nhân tạo trong giáo dục.

Mỗi thư mục là một trang. File `index.html` trong thư mục là trang được mở.

| Thư mục | Hoạt động |
|---|---|
| (gốc) `index.html` | Trang chủ |
| `khoi-dong/` | 1. Khởi động |
| `noi-dung-1-2/` | 2. Hình thành kiến thức, nội dung 1 và 2 |
| `noi-dung-3/` | 3. Nội dung 3: Báo động thật hay giả? |
| `luyen-tap/` | 4. Luyện tập (game) |
| `giao-vien/` | Màn hình giáo viên |
| `assets/style.css` | Kiểu chữ, màu dùng chung |

Quy ước: ai phụ trách thư mục nào thì chỉ sửa thư mục đó.

## Quy ước khi viết trang

- Link tới CSS và tới trang khác luôn dùng **đường dẫn tương đối** (`../assets/style.css`, `../noi-dung-3/`), không dùng `/assets/...`. Web chạy ở địa chỉ con `.../tieuluan-ck-ttnt/`, dấu `/` ở đầu sẽ trỏ sai.
- Mỗi trang hoạt động giữ thanh `<nav class="dieu-huong">` ở cuối (Trước · Trang chủ · Tiếp theo) để giáo viên bấm chuyển hoạt động trong tiết.
- Ảnh, video, file JS riêng của trang nào thì để trong thư mục của trang đó.
- Khi trang đã có nội dung thật, xoá khối `<div class="khung-trong">`.

## Upload lên GitHub đúng cách (đọc trước khi upload)

GitHub **không tự giải nén file .zip**, và nút "choose your files" **chỉ chọn được file, không chọn được thư mục**. Nếu chọn file lẻ từ nhiều thư mục, mọi file rơi ra thư mục gốc, các file `index.html` cùng tên sẽ đè lên nhau.

Cách đúng trên web GitHub:

1. Giải nén .zip trên máy.
2. Mở thư mục vừa giải nén, chọn **tất cả** bên trong (Ctrl+A): các thư mục `assets`, `khoi-dong`, ... cùng `index.html`, `README.md`.
3. Vào repo → **Add file → Upload files** → **kéo thả** cả cụm đó vào trang (kéo thả thì giữ được thư mục; đừng bấm "choose your files").
4. Kiểm tra danh sách file trước khi Commit: phải thấy dạng `khoi-dong/index.html`, `assets/style.css`.

Upload không xoá file cũ. File nào nằm sai chỗ thì mở file đó → biểu tượng thùng rác → Commit.

Cách bền hơn: dùng **GitHub Desktop** (clone repo về máy, sửa trong thư mục, Commit → Push), không bao giờ bị dẹt thư mục.

## Xem web

Settings → Pages → Source: *Deploy from a branch* → Branch: `main`, thư mục `/ (root)` → Save. Sau 1–2 phút web có ở:

`https://nguyenkhoi6107-ux.github.io/tieuluan-ck-ttnt/`
