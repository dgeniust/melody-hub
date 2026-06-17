// src/api/fetchClient.ts

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

// Tạo một hàm request chung để thay thế cho axiosClient
export const fetchClient = async <T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> => {
  const token = localStorage.getItem("accessToken");

  // 1. Tự động đính kèm Headers chung (Token, Content-Type)
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const config: RequestInit = {
    ...options,
    headers,
  };

  // 2. Gọi fetch API nguyên bản của trình duyệt
  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  // 3. Xử lý lỗi HTTP (Fetch KHÔNG tự throw lỗi khi gặp 400, 401, 500...)
  if (!response.ok) {
    if (response.status === 401) {
      // Xử lý khi token hết hạn (ví dụ: logout)
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `HTTP error! status: ${response.status}`,
    );
  }

  // 4. Nếu thành công, tự động parse JSON và ép kiểu dữ liệu <T>
  return response.json() as Promise<T>;
};
