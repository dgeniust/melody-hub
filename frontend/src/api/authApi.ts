import { fetchClient } from "./fetch";

// 1. Dữ liệu trả về khi Đăng nhập thành công (JWT Tokens)
export interface AuthResponse {
  access: string;
  refresh: string;
}
export interface LoginRequest {
  username: string;
  password: string;
}
export interface RegisterRequest extends LoginRequest {
  email: string;
}
export interface RegisterResponse {
  username: string;
  email: string;
}
// 2. Cấu hình cấu trúc thông tin User lấy từ API Profile
export interface UserProfile {
  username: string;
  email: string;
  message?: string; // Dấu '?' nghĩa là trường này có thể có hoặc không
}
export interface LogoutResponse {
  message: string;
}
// 3. Type cho lỗi trả về từ Backend Django (để handle thông báo lỗi lên giao diện)
export interface AuthErrorResponse {
  detail?: string; // Lỗi chung từ JWT (Ví dụ: "Token is invalid or expired")
  username?: string[]; // Lỗi từ form đăng ký (Ví dụ: ["Username này đã tồn tại"])
  email?: string[];
  password?: string[];
  duration?: string[]; // Thừa hưởng từ các lỗi validate khác nếu có
}
// 2. Định nghĩa các hàm gọi API
const authAPi = {
  login(data: LoginRequest): Promise<AuthResponse> {
    return fetchClient<AuthResponse>("/auth/login/", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  register(data: LoginRequest): Promise<RegisterResponse> {
    return fetchClient<RegisterResponse>("/auth/register/", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  logout(): Promise<LogoutResponse> {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    try {
      // Gọi API logout lên Django để cho refresh token vào blacklist
      return fetchClient<LogoutResponse>("/auth/logout/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`, // Xác thực quyền gọi API
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });
    } catch (error) {
      console.error("Lỗi khi xử lý hủy token ở Backend:", error);
      throw error;
    } finally {
      // Bất kể backend trả về thành công hay lỗi (ví dụ token hết hạn trước đó),
      // Front-end luôn phải xóa sạch token trên máy client và đá user về trang login
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userId");
      localStorage.removeItem("user");
    }
  },
};

export default authAPi;
