# MelodyHub

## Giới thiệu

MelodyHub là một ứng dụng nền tảng âm nhạc gồm backend Django REST API và frontend React + TypeScript. Hệ thống cung cấp tính năng đăng ký, đăng nhập, JWT authentication, quản lý playlist, yêu thích bài hát, và chức năng quên mật khẩu.

## Cấu trúc dự án

- `backend/`
  - `manage.py`: entrypoint để chạy server Django và quản lý migrations.
  - `requirements.txt`: danh sách các thư viện Python.
  - `core/`: cấu hình Django chung.
    - `settings.py`: cấu hình hệ thống, database, CORS, REST Framework, JWT.
    - `urls.py`: khai báo route chính và include API app.
    - `wsgi.py`, `asgi.py`: cấu hình deployment.
  - `music/`: app Django chính của dự án.
    - `models.py`: định nghĩa các model `Artist`, `Song`, `Genre`, `Album`, `Playlist`, `FavoriteSong`.
    - `serializers.py`: định nghĩa serializer cho API, bao gồm đăng ký người dùng, reset mật khẩu, playlist, favorite.
    - `views.py`: định nghĩa viewsets và API views cho CRUD, auth, profile, logout, reset password.
    - `urls.py`: cấu hình router REST và các endpoint auth.

- `frontend/`
  - `package.json`: cấu hình npm scripts và dependencies.
  - `vite.config.ts`: cấu hình Vite.
  - `src/`
    - `App.tsx`: entry component hiện tại render `AuthPages`.
    - `main.tsx`: render React vào DOM.
    - `api/`: helper gọi API và định nghĩa type.
      - `fetch.ts`: fetch client chung tự động thêm JWT header và xử lý lỗi.
      - `authApi.ts`: gọi endpoint auth (login, register, logout).
      - `songApi.ts`: gọi endpoint playlist.
      - `types.ts`: định nghĩa TypeScript interfaces cho dữ liệu.
    - `context/`
      - `AuthContext.tsx`: quản lý trạng thái user và lấy profile từ backend.
    - `pages/`
      - `AuthPages.tsx`: giao diện đăng nhập, đăng ký, quên mật khẩu, reset password.
      - `Dashboard.tsx`: giao diện dashboard với danh sách nhạc giả lập và component mini player.
    - `components/`
      - `MusicCardPlayer.tsx`: component player / thẻ nhạc.
      - `ProfileSettings.tsx`: component profile người dùng.
    - `assets/`: chứa file tĩnh và tài nguyên giao diện.
    - `styles`: Tailwind/CSS tùy chỉnh.

## Tech stack

### Backend

- Python 3.x
- Django 5.x
- Django REST Framework
- Django CORS Headers
- djangorestframework-simplejwt
- MySQL (`mysqlclient`)
- dotenv/environ để đọc biến môi trường

### Frontend

- React 19
- TypeScript 6
- Vite 5/8
- Tailwind CSS 4
- React Router DOM 7
- lucide-react
- ESLint

## Luồng dữ liệu chính

### Backend

1. Người dùng gửi yêu cầu đến endpoint qua route `backend/core/urls.py` và `backend/music/urls.py`.
2. Các API REST chứa trong `music/views.py` sử dụng `ModelViewSet` cho `Artist`, `Song`, `Album`, `Playlist`, `FavoriteSong`.
3. Dữ liệu được chuyển đổi bằng `serializers.py` trước khi lưu vào database hoặc trả về client.
4. Authentication sử dụng JWT từ `rest_framework_simplejwt`.
5. `RegisterView` tạo user mới, `TokenObtainPairView` trả access và refresh token.
6. `LogoutView` blacklist refresh token để huỷ đăng nhập.
7. `ForgotPasswordView` và `ResetPasswordConfirmView` xử lý luồng quên mật khẩu.

### Frontend

1. `src/api/fetch.ts` là HTTP client chung, tự động thêm `Authorization: Bearer <token>` nếu có.
2. `src/api/authApi.ts` gọi endpoint auth và lưu token vào `localStorage`.
3. `AuthContext.tsx` dùng `useEffect` để lấy profile khi có access token.
4. `AuthPages.tsx` cung cấp giao diện đăng nhập/đăng ký và thay đổi password.
5. `Dashboard.tsx` hiển thị dữ liệu giả lập, profile từ context, và mini player.

## Cách cài đặt và chạy

### Backend

1. Tạo environment ảo và cài dependencies:

```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

2. Tạo file `.env` trong `backend/` với các biến:

```
SECRET_KEY=your-secret-key
DEBUG=True
DB_NAME=your_db_name
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=localhost
DB_PORT=3306
JWT_ACCESS_TOKEN_LIFETIME_MINUTES=15
JWT_REFRESH_TOKEN_LIFETIME_DAYS=7
```

3. Chạy migrations và server:

```powershell
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
```

### Frontend

1. Cài dependencies:

```powershell
cd frontend
npm install
```

2. Chạy dự án:

```powershell
npm run dev
```

3. Mặc định frontend sẽ kết nối tới `http://localhost:8000/api`.

## Lưu ý quan trọng

- Backend sử dụng MySQL. Đảm bảo database đã tồn tại và các biến `.env` đúng.
- `settings.py` chỉ cấu hình `CORS_ALLOWED_ORIGINS` cho `http://localhost:5173`.
- Frontend hiện chưa có router đầy đủ cho trang `Dashboard`; hiện tại `App.tsx` chỉ render `AuthPages`.
- `AuthPages.tsx` có một số phần demo cho tính năng reset password và chưa gọi API quên mật khẩu / reset password thật.
- Frontend lưu `accessToken`, `refreshToken`, `userId` và `user` trong `localStorage`.
- `fetch.ts` khi gặp 401 sẽ xóa token và chuyển về `/login`.

## Thành phần chính

### Backend models

- `Artist`: nghệ sĩ với bio, avatar, theo dõi.
- `Song`: bài hát liên kết tới `Artist`, chứa url audio và cover.
- `Genre`: thể loại nhạc.
- `Album`: album liên kết tới `Artist`.
- `Playlist`: playlist của user, nhiều bài hát.
- `FavoriteSong`: bài hát yêu thích của user.

### Frontend API và context

- `fetchClient`: hàm gốc dùng `fetch` để gọi API.
- `authApi.login`, `authApi.register`, `authApi.logout`.
- `AuthContext`: quản lý profile user và cung cấp `user` cho component.
- `AuthPages`: hiển thị các form auth.
- `Dashboard`: layout chính với sidebar, bảng track list và player.

## Hướng mở rộng

- Thêm router `react-router-dom` để điều hướng giữa Auth và Dashboard.
- Hoàn thiện API frontend với các endpoint playlist, favorites, songs, albums.
- Load dữ liệu thực tế từ backend vào dashboard thay vì dùng dữ liệu giả lập.
- Hoàn thiện form đăng ký, quên mật khẩu, reset password thật với fetch API.
- Thêm validation front-end và hiển thị thông báo lỗi chi tiết.
- Bổ sung phân quyền cho API `ArtistController`, `AlbumController`, `PlaylistController`.

## Tóm tắt

MelodyHub là dự án fullstack với Django REST API cho backend và React + TypeScript cho frontend. Backend xử lý auth JWT, quản lý nhạc, playlist và yêu thích. Frontend dùng Tailwind với Vite, gọi API thông qua client chung và dùng context để giữ trạng thái user.
