import { useState, useEffect, useRef } from "react";
import { ChevronDown, User, Settings, LogOut, LogIn } from "lucide-react";
import authAPi from "../api/authApi";
import { useNavigate } from "react-router-dom";

interface UserType {
  username?: string;
  email?: string;
  avatarUrl?: string; // Thêm nếu sau này bạn muốn truyền avatar động
}

const ProfileSettings = ({ user }: { user: UserType | null | undefined }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  // Tự động đóng dropdown khi click ra ngoài vùng menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // TRƯỜNG HỢP 1: CHƯA ĐĂNG NHẬP (Không có user)
  if (!user) {
    return (
      <button
        onClick={() => navigate("/auth")} // Thay bằng hàm điều hướng của bạn (ví dụ: router.push('/login'))
        className="bg-sunbeam-yellow text-charcoal-ink border-2 border-charcoal-ink rounded-xl px-5 py-2 flex items-center gap-2 font-bold text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
      >
        <LogIn className="w-4 h-4 stroke-[2.5]" />
        Đăng nhập
      </button>
    );
  }

  // TRƯỜNG HỢP 2: ĐÃ ĐĂNG NHẬP (Có user) -> Hiện Dropdown như cũ
  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Nút bấm để Toggle Dropdown */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-snow border-2 border-charcoal-ink rounded-xl px-4 py-2 flex items-center gap-3 self-end sm:self-auto hover:bg-opacity-90 transition-all cursor-pointer focus:outline-none"
      >
        <div className="w-8 h-8 rounded-full bg-sunbeam-yellow border-2 border-charcoal-ink overflow-hidden flex-shrink-0">
          <img
            src={
              user.avatarUrl ||
              "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&auto=format&fit=crop&q=80"
            }
            alt="Avatar"
            className="w-full h-full object-cover"
          />
        </div>
        <span className="font-bold text-sm text-charcoal-ink">
          {user.username || "User"}
        </span>
        <ChevronDown
          className={`w-4 h-4 stroke-[2.5] transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Menu Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl border-2 border-charcoal-ink bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50 overflow-hidden">
          {/* Header hiển thị nhanh thông tin user */}
          <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
            <p className="text-xs text-gray-500">Đăng nhập với tư cách</p>
            <p className="text-sm font-bold truncate text-charcoal-ink">
              {user.email || "Chưa cập nhật email"}
            </p>
          </div>

          <div className="py-1">
            {/* Mục: Thông tin cá nhân */}
            <button
              onClick={() => {
                console.log("Profile clicked");
                setIsOpen(false);
              }}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium text-charcoal-ink hover:bg-gray-100 transition-colors text-left"
            >
              <User className="w-4 h-4 text-gray-500" />
              Thông tin cá nhân
            </button>

            {/* Mục: Cài đặt */}
            <button
              onClick={() => {
                console.log("Settings clicked");
                setIsOpen(false);
              }}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium text-charcoal-ink hover:bg-gray-100 transition-colors text-left"
            >
              <Settings className="w-4 h-4 text-gray-500" />
              Cài đặt hệ thống
            </button>

            <hr className="border-gray-200 my-1" />

            {/* Mục: Đăng xuất */}
            <button
              onClick={() => {
                authAPi.logout();
                setIsOpen(false);
                navigate("/auth");
              }}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors text-left"
            >
              <LogOut className="w-4 h-4 text-red-500" />
              Đăng xuất
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileSettings;
