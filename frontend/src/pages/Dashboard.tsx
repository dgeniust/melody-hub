import {
  Home,
  Search,
  Heart,
  SquarePlus,
  Album,
  Users,
  Settings,
  ChevronDown,
  Flame,
  Radio,
  Sparkles,
  Clock,
} from "lucide-react";
import MusicCardPlayer from "../components/MusicCardPlayer";
import ProfileSettings from "../components/ProfileSettings";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";

export default function Dashboard() {
  // Dữ liệu giả lập cho danh sách bài hát vừa nghe (Listening History)
  const historySongs = [
    {
      id: 1,
      title: "She Will Be Loved",
      artist: "Maroon 5",
      plays: "1.2M",
      cover:
        "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=150&auto=format&fit=crop&q=60",
      color: "bg-powder-blue",
    },
    {
      id: 2,
      title: "Dumb Little Bug",
      artist: "Em Beihold",
      plays: "840K",
      cover:
        "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=150&auto=format&fit=crop&q=60",
      color: "bg-mint-wash",
    },
    {
      id: 3,
      title: "Lời Có Cánh",
      artist: "OSAD",
      plays: "310K",
      cover:
        "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=150&auto=format&fit=crop&q=60",
      color: "bg-lilac-tint",
    },
  ];

  // Dữ liệu mới bổ sung cho danh sách phát chi tiết (Bảng nội dung ở Center)
  const hotTracks = [
    {
      id: "01",
      title: "As It Was",
      artist: "Harry Styles",
      album: "Harry's House",
      duration: "2:47",
      tag: "Hot",
      tagColor: "bg-ember-orange text-snow",
    },
    {
      id: "02",
      title: "Left and Right",
      artist: "Charlie Puth (feat. Jung Kook)",
      album: "Charlie",
      duration: "2:34",
      tag: "New",
      tagColor: "bg-lime-zest text-charcoal-ink",
    },
    {
      id: "03",
      title: "Double Take",
      artist: "dhruv",
      album: "rapunzel",
      duration: "2:51",
      tag: "Chill",
      tagColor: "bg-sunbeam-yellow text-charcoal-ink",
    },
    {
      id: "04",
      title: "Until I Found You",
      artist: "Stephen Sanchez",
      album: "Easy On My Eyes",
      duration: "2:57",
      tag: "Retro",
      tagColor: "bg-powder-blue text-charcoal-ink",
    },
  ];
  const { user } = useAuth();
  const storedUserId = localStorage.getItem("userId");
  const userId = storedUserId ? Number(JSON.parse(storedUserId)) : null;
  console.log("user id ----: ", userId);
  useEffect(() => {
    console.log("Dữ liệu user thực tế thay đổi thành:", user);
    // console.log(user.user_id);
  }, [user, userId]);
  return (
    <div className="min-h-screen w-full bg-peach-paper font-manrope text-charcoal-ink p-4 md:p-6 lg:p-8 flex flex-col gap-6 select-none relative ">
      {/* CRAYON DOODLES DECORATION (Floating Line-Art Style) */}
      <div className="absolute top-40 right-10 text-4xl opacity-20 pointer-events-none font-alfa">
        🎵
      </div>
      <div className="absolute bottom-10 left-4 text-5xl opacity-20 pointer-events-none">
        ✨
      </div>

      {/* TOP BAR / HEADER */}
      <header className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2">
        <div>
          <h1 className="font-alfa text-4xl lg:text-5xl tracking-tight leading-none">
            MelodyHub Studio<span className="text-ember-orange">.</span>
          </h1>
          <p className="text-xs font-bold mt-1 text-gray-600 uppercase tracking-wider">
            Không gian âm nhạc thủ công
          </p>
        </div>

        {/* User Profile Pill */}
        <ProfileSettings user={user} />
      </header>

      {/* MAIN LAYOUT CONTAINER */}
      <div className="w-full flex flex-col lg:flex-row items-start gap-6">
        {/* NAVIGATION SIDEBAR */}
        <aside className="w-full lg:w-64 bg-snow border-2 border-charcoal-ink rounded-lpalo p-5 flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible shrink-0 scrollbar-none lg:sticky lg:top-6 lg:max-h-[calc(100vh-3rem)] lg:overflow-y-auto">
          <div className="flex lg:flex-col gap-1.5 w-full min-w-max lg:min-w-0">
            <button className="flex items-center gap-3 px-4 py-3 rounded-lpalo border-2 border-charcoal-ink bg-mint-wash font-bold text-sm transition-transform active:scale-95">
              <Home className="w-5 h-5 stroke-[2.5]" /> <span>Trang chủ</span>
            </button>
            <button className="flex items-center gap-3 px-4 py-3 rounded-lpalo border-2 border-transparent hover:border-charcoal-ink bg-transparent font-bold text-sm text-gray-700 hover:text-charcoal-ink transition-colors">
              <Search className="w-5 h-5 stroke-[2.5]" /> <span>Tìm kiếm</span>
            </button>
            <button className="flex items-center gap-3 px-4 py-3 rounded-lpalo border-2 border-transparent hover:border-charcoal-ink bg-transparent font-bold text-sm text-gray-700 hover:text-charcoal-ink transition-colors">
              <Heart className="w-5 h-5 stroke-[2.5]" /> <span>Yêu thích</span>
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

        {/* CENTER CONTENT: RESTRUCTURED & FILLED */}
        <section className="flex-1 w-full flex flex-col gap-6">
          {/* HERO BANNER - BÀI HÁT POPULAR NỔI BẬT */}
          <div className="w-full bg-lilac-tint border-2 border-charcoal-ink rounded-lpalo p-6 md:p-8 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-2 z-10 max-w-lg">
              <span className="bg-sunbeam-yellow text-xs font-black uppercase px-3 py-1 border-2 border-charcoal-ink rounded-lpalo-sm tracking-wider inline-block">
                Đang phát nhiều nhất
              </span>
              <h2 className="font-alfa text-3xl md:text-4xl lg:text-5xl tracking-tight leading-none mt-2">
                She Will Be Loved
              </h2>
              <p className="text-sm font-bold text-gray-800">
                Maroon 5 — Album Songs About Jane
              </p>
              <div className="pt-2 flex gap-2">
                <button className="px-5 py-2.5 bg-snow border-2 border-charcoal-ink rounded-lpalo font-bold text-xs active:translate-y-0.5 transition-transform">
                  Nghe ngay lúc này
                </button>
                <button className="p-2.5 bg-transparent border-2 border-charcoal-ink rounded-full hover:bg-snow transition-colors">
                  <Heart className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>
            </div>

            <div className="w-32 h-32 md:w-40 md:h-40 bg-snow border-2 border-charcoal-ink rounded-full flex items-center justify-center shrink-0 mx-auto md:mx-0 relative animate-[spin_12s_linear_infinite]">
              <div className="w-12 h-12 bg-peach-paper border-2 border-charcoal-ink rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-charcoal-ink rounded-full"></div>
              </div>
            </div>
          </div>

          {/* NEW CONTENT ELEMENT 1: CRAYON QUICK STATS CARDS (Điền chỗ trống bằng thẻ màu sắc) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-amber-orange text-black rounded-lpalo border-2 border-charcoal-ink flex items-center gap-4">
              <div className="p-3 bg-snow rounded-full border-2 border-charcoal-ink text-charcoal-ink">
                <Flame className="w-5 h-5 fill-current" />
              </div>
              <div>
                <div className="text-[11px] font-black uppercase tracking-wider opacity-90">
                  Xu hướng tuần
                </div>
                <div className="font-alfa text-lg leading-none mt-0.5">
                  Top 50 Pop
                </div>
              </div>
            </div>

            <div className="p-4 bg-sunbeam-yellow text-charcoal-ink rounded-lpalo border-2 border-charcoal-ink flex items-center gap-4">
              <div className="p-3 bg-snow rounded-full border-2 border-charcoal-ink">
                <Radio className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] font-black uppercase tracking-wider text-gray-700">
                  Trạm phát sóng
                </div>
                <div className="font-alfa text-lg leading-none mt-0.5">
                  MelodyHub Radio Live
                </div>
              </div>
            </div>

            <div className="p-4 bg-mint-wash text-charcoal-ink rounded-lpalo border-2 border-charcoal-ink flex items-center gap-4">
              <div className="p-3 bg-snow rounded-full border-2 border-charcoal-ink">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] font-black uppercase tracking-wider text-gray-700">
                  Dành riêng cho bạn
                </div>
                <div className="font-alfa text-lg leading-none mt-0.5">
                  Mix Thủ Công
                </div>
              </div>
            </div>
          </div>

          {/* LISTENING HISTORY SECTION */}
          <div className="bg-snow border-2 border-charcoal-ink rounded-lpalo p-6">
            <h3 className="font-alfa text-xl mb-4 tracking-tight">
              Vừa nghe gần đây
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {historySongs.map((song) => (
                <div
                  key={song.id}
                  className="p-3 border-2 border-charcoal-ink rounded-lpalo flex md:flex-col items-center md:items-start gap-4 bg-peach-paper/30 hover:bg-peach-paper/60 transition-colors"
                >
                  <img
                    src={song.cover}
                    alt={song.title}
                    className="w-16 h-16 md:w-full md:h-32 object-cover rounded-lpalo-sm border-2 border-charcoal-ink shrink-0"
                  />
                  <div className="flex-1 w-full min-w-0">
                    <h4 className="font-bold text-sm truncate">{song.title}</h4>
                    <p className="text-xs text-gray-600 font-medium truncate mt-0.5">
                      {song.artist}
                    </p>
                    <div className="mt-2 flex items-center justify-between text-[11px] font-black text-gray-500 uppercase tracking-wider">
                      <span>🎧 {song.plays} lượt</span>
                      <span
                        className={`px-2 py-0.5 border border-charcoal-ink rounded-lpalo-sm text-[9px] ${song.color}`}
                      >
                        Pop
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* NEW CONTENT ELEMENT 2: COMPLETE TRACKLIST TABLE (Lấp đầy không gian Center bằng danh sách chi tiết) */}
          <div className="bg-snow border-2 border-charcoal-ink rounded-lpalo p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-alfa text-xl tracking-tight">
                Đề xuất phổ biến hôm nay
              </h3>
              <span className="text-xs font-bold underline cursor-pointer hover:text-ember-orange">
                Xem tất cả
              </span>
            </div>

            <div className="w-full overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[500px]">
                <thead>
                  <tr className="border-b-2 border-charcoal-ink text-xs font-black uppercase text-gray-500 tracking-wider">
                    <th className="pb-3 pl-2 w-12">#</th>
                    <th className="pb-3">Tiêu đề</th>
                    <th className="pb-3">Album / Tuyển tập</th>
                    <th className="pb-3 text-right pr-2">
                      <Clock className="w-4 h-4 inline" />
                    </th>
                  </tr>
                </thead>
                <tbody className="text-sm font-bold divide-y-2 divide-gray-100">
                  {hotTracks.map((track) => (
                    <tr
                      key={track.id}
                      className="hover:bg-peach-paper/20 group transition-colors"
                    >
                      <td className="py-3.5 pl-2 font-alfa text-gray-400 group-hover:text-charcoal-ink">
                        {track.id}
                      </td>
                      <td className="py-3.5">
                        <div className="flex items-center gap-2">
                          <span>{track.title}</span>
                          <span
                            className={`text-[9px] px-1.5 py-0.5 border border-charcoal-ink rounded-lpalo-sm font-black ${track.tagColor}`}
                          >
                            {track.tag}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 font-medium mt-0.5">
                          {track.artist}
                        </div>
                      </td>
                      <td className="py-3.5 text-gray-600 font-medium">
                        {track.album}
                      </td>
                      <td className="py-3.5 text-right pr-2 text-gray-500 font-medium">
                        {track.duration}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* RIGHT SIDEBAR: MINI PLAYER */}
        <aside className="w-full lg:w-80 lg:sticky lg:top-6 lg:max-h-[calc(100vh-3rem)] lg:overflow-y-auto space-y-4 pr-1">
          <MusicCardPlayer userId={userId} />
        </aside>
      </div>
    </div>
  );
}
