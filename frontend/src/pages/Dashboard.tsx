import { Clock } from "lucide-react";
import { Heart } from "lucide-react";
import { Flame, Radio, Sparkles } from "lucide-react";
import MusicCharts from "../components/MusicChart";

export default function Dashboard() {
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

  return (
    <section className="w-full flex flex-col gap-6">
      {/* HERO BANNER */}
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

      {/* QUICK STATS CARDS */}
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

      {/* MUSIC CHARTS COMPONENT */}
      <MusicCharts />

      {/* TRACKLIST TABLE */}
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
  );
}
