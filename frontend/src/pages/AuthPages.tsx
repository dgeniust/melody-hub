import React, { useState } from "react";
import authAPi, { type LoginRequest } from "../api/authApi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { jwtDecode } from "jwt-decode";

type AuthView = "login" | "register" | "forgot-pass" | "reset-pass";
interface CustomTokenPayload {
  token_type: string;
  exp: number;
  iat: number;
  jti: string;
  user_id: string; // Đây chính là key bạn cần
}
export default function AuthPages() {
  const [view, setView] = useState<AuthView>("login");

  // States cho Form dữ liệu
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Giả lập uidb64 và token nhận được từ URL của email gửi cho Reset Password
  const [uidb64] = useState("msh3bx");
  const [token] = useState("c2b7-xyz123");
  const navigate = useNavigate();
  // Xử lý thông báo (Error / Success)
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const { setUser, fetchUserProfile } = useAuth();
  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setMessage({
        type: "error",
        text: "Không tìm thấy tài khoản nào với email này.",
      }); // Trả về lỗi giống validate_email
      return;
    }
    setMessage({
      type: "success",
      text: "Hệ thống đã gửi liên kết đặt lại mật khẩu vào Email của bạn!",
    });
  };

  const handleResetPasswordConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword) {
      setMessage({
        type: "error",
        text: "Đường dẫn không hợp lệ hoặc đã hết hạn.",
      }); // Trả về lỗi giống validate
      return;
    }
    setMessage({
      type: "success",
      text: "Mật khẩu của bạn đã được thay đổi thành công!",
    });
    setTimeout(() => {
      setView("login");
      setMessage(null);
    }, 2000);
  };
  const handleLogin = async () => {
    try {
      const data: LoginRequest = {
        username: username,
        password: password,
      };
      console.log("Data req: ", JSON.stringify(data));
      const res = await authAPi.login(data);
      if (res) {
        localStorage.setItem("accessToken", res.access);
        const decoded = jwtDecode<CustomTokenPayload>(res.access);
        localStorage.setItem("userId", JSON.stringify(decoded.user_id));
        fetchUserProfile(res.access);
        localStorage.setItem("refreshToken", res.refresh);
        navigate("/");
      }
      console.log(res);
    } catch (err) {}
  };
  return (
    <div className="min-h-screen w-full bg-peach-paper font-manrope text-charcoal-ink flex flex-col justify-between p-6 relative overflow-hidden select-none">
      {/* Các hình vẽ Doodle trang trí ngẫu nhiên (Line-Art Illustrations) theo style Storybook */}
      <div className="absolute top-12 left-10 text-4xl opacity-40 rotate-[-12deg] pointer-events-none font-alfa">
        ✏️
      </div>
      <div className="absolute bottom-20 left-16 text-5xl opacity-30 rotate-[15deg] pointer-events-none">
        🎨
      </div>
      <div className="absolute top-24 right-14 text-6xl opacity-30 rotate-[25deg] pointer-events-none">
        🎧
      </div>
      <div className="absolute bottom-12 right-20 text-5xl opacity-40 rotate-[-8deg] pointer-events-none">
        🚀
      </div>

      {/* Header / Brand Logo */}
      <header className="max-w-[1200px] w-full mx-auto flex justify-between items-center py-4">
        <div
          className="font-alfa text-2xl tracking-wider cursor-pointer"
          onClick={() => setView("login")}
        >
          MelodyHub <span className="text-ember-orange">.</span>
        </div>
        <div className="hidden md:flex gap-2">
          <button
            onClick={() => setView("login")}
            className={`px-5 py-2.5 border-2 border-charcoal-ink rounded-MelodyHub font-medium text-sm transition-all ${view === "login" ? "bg-mint-wash" : "bg-snow"}`}
          >
            Đăng nhập
          </button>
          <button
            onClick={() => setView("register")}
            className={`px-5 py-2.5 border-2 border-charcoal-ink rounded-MelodyHub font-medium text-sm transition-all ${view === "register" ? "bg-magenta-pop text-snow" : "bg-snow"}`}
          >
            Đăng ký
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center py-10 z-10">
        <div className="w-full max-w-md bg-snow border-2 border-charcoal-ink rounded-MelodyHub p-8 md:p-10 transition-transform duration-300">
          {/* Toast Message hiển thị Validation Lỗi / Thành công */}
          {message && (
            <div
              className={`mb-6 p-4 rounded-MelodyHub-sm border-2 border-charcoal-ink font-semibold text-sm ${message.type === "error" ? "bg-ember-orange text-snow" : "bg-sunbeam-yellow"}`}
            >
              {message.type === "error" ? "⚠️ " : "🎉 "} {message.text}
            </div>
          )}

          {/* VIEW 1: LOGIN */}
          {view === "login" && (
            <div>
              <h2 className="font-alfa text-4xl mb-2 leading-[1.09] tracking-tight text-left">
                Chào bạn quay lại!
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                Nhập thông tin để tiếp tục khám phá câu chuyện.
              </p>

              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label className="block text-sm font-bold mb-1.5 ml-2">
                    Tên đăng nhập
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="username_cua_ban"
                    className="w-full px-5 py-3 border-2 border-charcoal-ink rounded-MelodyHub text-sm focus:outline-none focus:bg-peach-paper"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1.5 ml-2">
                    Mật khẩu
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-5 py-3 border-2 border-charcoal-ink rounded-MelodyHub text-sm focus:outline-none focus:bg-peach-paper"
                  />
                </div>

                <div className="text-right">
                  <span
                    onClick={() => {
                      setView("forgot-pass");
                      setMessage(null);
                    }}
                    className="text-xs font-bold underline cursor-pointer hover:text-ember-orange"
                  >
                    Quên mật khẩu?
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-ember-orange text-white font-bold border-2 border-charcoal-ink rounded-MelodyHub mt-2 text-base tracking-wide active:translate-y-0.5 transition-all text-center block"
                  onClick={() => handleLogin()}
                >
                  Đăng nhập ngay
                </button>
              </form>

              <div className="mt-6 text-center text-sm">
                Chưa có tài khoản?{" "}
                <span
                  onClick={() => {
                    setView("register");
                    setMessage(null);
                  }}
                  className="font-bold underline cursor-pointer text-magenta-pop"
                >
                  Tạo tài khoản mới
                </span>
              </div>
            </div>
          )}

          {/* VIEW 2: REGISTER */}
          {view === "register" && (
            <div>
              <h2 className="font-alfa text-4xl mb-2 leading-[1.09] tracking-tight">
                Tham gia cùng tụi mình.
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                Đăng ký tài khoản nhanh chóng trong 1 nốt nhạc.
              </p>

              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label className="block text-sm font-bold mb-1.5 ml-2">
                    Tên đăng nhập
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="dat_handmade"
                    className="w-full px-5 py-3 border-2 border-charcoal-ink rounded-MelodyHub text-sm focus:outline-none focus:bg-peach-paper"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1.5 ml-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="vi_du@gmail.com"
                    className="w-full px-5 py-3 border-2 border-charcoal-ink rounded-MelodyHub text-sm focus:outline-none focus:bg-peach-paper"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1.5 ml-2">
                    Mật khẩu
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-5 py-3 border-2 border-charcoal-ink rounded-MelodyHub text-sm focus:outline-none focus:bg-peach-paper"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-lilac-tint font-bold border-2 border-charcoal-ink rounded-MelodyHub mt-4 text-base tracking-wide text-center block"
                >
                  Bắt đầu hành trình
                </button>
              </form>

              <div className="mt-6 text-center text-sm">
                Đã có tài khoản?{" "}
                <span
                  onClick={() => {
                    setView("login");
                    setMessage(null);
                  }}
                  className="font-bold underline cursor-pointer text-ember-orange"
                >
                  Đăng nhập
                </span>
              </div>
            </div>
          )}

          {/* VIEW 3: FORGOT PASSWORD */}
          {view === "forgot-pass" && (
            <div>
              <h2 className="font-alfa text-4xl mb-2 leading-[1.09] tracking-tight">
                Tìm mật khẩu?
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                Đừng lo lắng, hãy nhập Email đăng ký hệ thống để nhận đường dẫn
                đặt lại.
              </p>

              <form className="space-y-4" onSubmit={handleForgotPassword}>
                <div>
                  <label className="block text-sm font-bold mb-1.5 ml-2">
                    Email tài khoản
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nhap_email_cua_ban@gmail.com"
                    className="w-full px-5 py-3 border-2 border-charcoal-ink rounded-MelodyHub text-sm focus:outline-none focus:bg-peach-paper"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-sunbeam-yellow font-bold border-2 border-charcoal-ink rounded-MelodyHub mt-4 text-base tracking-wide text-center block"
                >
                  Gửi yêu cầu xác nhận
                </button>
              </form>

              <div className="mt-6 text-center text-sm flex justify-between px-2">
                <span
                  onClick={() => {
                    setView("login");
                    setMessage(null);
                  }}
                  className="font-bold underline cursor-pointer"
                >
                  Quay lại Đăng nhập
                </span>
                <span
                  onClick={() => {
                    setView("reset-pass");
                    setMessage(null);
                  }}
                  className="font-bold text-xs text-magenta-pop underline cursor-pointer"
                >
                  Giao diện Đổi Pass (Demo link)
                </span>
              </div>
            </div>
          )}

          {/* VIEW 4: RESET PASSWORD CONFIRM */}
          {view === "reset-pass" && (
            <div>
              <h2 className="font-alfa text-4xl mb-2 leading-[1.09] tracking-tight">
                Mật khẩu mới!
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Thiết lập lại mật khẩu an toàn của bạn tại đây.
              </p>

              {/* Box chứa thông tin debug giải mã từ Token Mail giống backend */}
              <div className="bg-peach-paper p-3 rounded-MelodyHub-sm text-[11px] font-mono text-gray-700 space-y-0.5 mb-4 border border-dashed border-charcoal-ink">
                <div>
                  📥 Base64 UID:{" "}
                  <span className="font-bold text-magenta-pop">{uidb64}</span>
                </div>
                <div>
                  🔑 Token State:{" "}
                  <span className="font-bold text-ember-orange">{token}</span>
                </div>
              </div>

              <form className="space-y-4" onSubmit={handleResetPasswordConfirm}>
                <div>
                  <label className="block text-sm font-bold mb-1.5 ml-2">
                    Mật khẩu mới
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-5 py-3 border-2 border-charcoal-ink rounded-MelodyHub text-sm focus:outline-none focus:bg-peach-paper"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-mint-wash font-bold border-2 border-charcoal-ink rounded-MelodyHub mt-4 text-base tracking-wide text-center block"
                >
                  Lưu mật khẩu & Đăng nhập
                </button>
              </form>

              <div className="mt-6 text-center text-sm">
                <span
                  onClick={() => {
                    setView("login");
                    setMessage(null);
                  }}
                  className="font-bold underline cursor-pointer"
                >
                  Hủy bỏ yêu cầu
                </span>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-[1200px] w-full mx-auto text-center py-4 text-xs font-medium text-gray-600">
        © 2026 MelodyHub Platform — Một trải nghiệm giao diện Storybook phá
        cách.
      </footer>
    </div>
  );
}
