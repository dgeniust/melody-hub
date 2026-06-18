import { Outlet } from "react-router-dom";
import {
  Home,
  Search,
  Heart,
  SquarePlus,
  Album,
  Users,
  Settings,
} from "lucide-react";
import MusicCardPlayer from "../components/MusicCardPlayer";
import ProfileSettings from "../components/ProfileSettings";
import { useAuth } from "../context/AuthContext";
import { MusicProvider } from "../context/MusicContext";

export default function RootLayout() {
  const { user } = useAuth();
  const storedUserId = localStorage.getItem("userId");
  const userId = storedUserId ? Number(JSON.parse(storedUserId)) : null;

  return (
    <MusicProvider userId={userId}>
      <div className="min-h-screen w-full bg-peach-paper font-manrope text-charcoal-ink p-4 md:p-6 lg:p-8 pb-24 flex flex-col gap-6 select-none relative ">
        {/* CRAYON DOODLES DECORATION (Các icon trang trí nền hệ thống) */}
        <div className="absolute top-40 right-10 text-4xl opacity-20 pointer-events-none font-alfa">
          🎵
        </div>
        <div className="absolute bottom-24 left-4 text-5xl opacity-20 pointer-events-none">
          ✨
        </div>

        {/* TOP BAR / HEADER FIXED FOR ALL PAGES */}
        <header className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2 z-10">
          <div>
            <h1 className="font-alfa text-4xl lg:text-5xl tracking-tight leading-none">
              MelodyHub Studio<span className="text-ember-orange">.</span>
            </h1>
            <p className="text-xs font-bold mt-1 text-gray-600 uppercase tracking-wider">
              Không gian âm nhạc thủ công
            </p>
          </div>
          <ProfileSettings user={user} />
        </header>

        {/* MAIN CONTAINER */}
        <div className="w-full flex flex-col lg:flex-row items-start gap-6">
          {/* GLOBAL NAVIGATION SIDEBAR */}
          <aside className="w-full lg:w-64 bg-snow border-2 border-charcoal-ink rounded-lpalo p-5 flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible shrink-0 scrollbar-none lg:sticky lg:top-6 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto">
            <div className="flex lg:flex-col gap-1.5 w-full min-w-max lg:min-w-0">
              <button className="flex items-center gap-3 px-4 py-3 rounded-lpalo border-2 border-charcoal-ink bg-mint-wash font-bold text-sm transition-transform active:scale-95">
                <Home className="w-5 h-5 stroke-[2.5]" /> <span>Trang chủ</span>
              </button>
              <button className="flex items-center gap-3 px-4 py-3 rounded-lpalo border-2 border-transparent hover:border-charcoal-ink bg-transparent font-bold text-sm text-gray-700 hover:text-charcoal-ink transition-colors">
                <Search className="w-5 h-5 stroke-[2.5]" />{" "}
                <span>Tìm kiếm</span>
              </button>
              <button className="flex items-center gap-3 px-4 py-3 rounded-lpalo border-2 border-transparent hover:border-charcoal-ink bg-transparent font-bold text-sm text-gray-700 hover:text-charcoal-ink transition-colors">
                <Heart className="w-5 h-5 stroke-[2.5]" />{" "}
                <span>Yêu thích</span>
              </button>
              <button className="flex items-center gap-3 px-4 py-3 rounded-lpalo border-2 border-transparent hover:border-charcoal-ink bg-transparent font-bold text-sm text-gray-700 hover:text-charcoal-ink transition-colors">
                <SquarePlus className="w-5 h-5 stroke-[2.5]" />{" "}
                <span>Tạo Playlist</span>
              </button>
            </div>

            <div className="hidden lg:block my-3 border-t-2 border-charcoal-ink border-dashed"></div>

            <div className="hidden lg:flex flex-col gap-1.5">
              <button className="flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-gray-600 hover:text-charcoal-ink text-left">
                <Album className="w-4 h-4" /> Tuyển tập Thu Đông
              </button>
              <button className="flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-gray-600 hover:text-charcoal-ink text-left">
                <Users className="w-4 h-4" /> Podcast Học Tập
              </button>
              <button className="flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-gray-600 hover:text-charcoal-ink text-left">
                <Settings className="w-4 h-4" /> Cài đặt hệ thống
              </button>
            </div>
          </aside>

          {/* INNER CONTENT AREA (Nơi Dashboard và các trang con khác hiển thị) */}
          <main className="flex-1 w-full min-w-0">
            <Outlet />
          </main>
        </div>

        {/* MINI BAR PLAYER - LUÔN CO-ĐỊNH ĐÁY MÀN HÌNH */}
        <footer className="mt-8">
          <MusicCardPlayer userId={userId} />
        </footer>
      </div>
    </MusicProvider>
  );
}
