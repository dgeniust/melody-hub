import {
  Play,
  Heart,
  Flame,
  Trophy,
  Album as AlbumIcon,
  Music,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { chartApi } from "../api/songApi";
import type { Album, SongMinimal } from "../api/types";

type ChartTab = "trending" | "albums";

export default function MusicCharts({
  onPlaySong,
}: {
  onPlaySong?: (song: any) => void;
}) {
  const [chartSongs, setChartSongs] = useState<SongMinimal[] | Album[]>();
  const [activeTab, setActiveTab] = useState<ChartTab>("trending");
  const [loading, setLoading] = useState<boolean>(false);

  // 1. API lấy Top 7 Ngày Trending
  const fetchTrendingData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await chartApi.get7DaysTrending();
      console.log("res 7 days trending: ", res);
      setChartSongs(res);
    } catch (err) {
      console.log("err in chart 7: ", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // 2. API lấy Top Albums
  const fetchTopAlbumsData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await chartApi.getTopAlbums();
      console.log("res top albums: ", res);
      setChartSongs(res);
    } catch (err) {
      console.log("err in top albums: ", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // 3. Theo dõi sự thay đổi của activeTab
  useEffect(() => {
    if (activeTab === "trending") {
      fetchTrendingData();
    } else {
      fetchTopAlbumsData();
    }
  }, [activeTab, fetchTrendingData, fetchTopAlbumsData]);

  const crayonColors = [
    "bg-mint-wash",
    "bg-lilac-tint",
    "bg-sunbeam-yellow",
    "bg-powder-blue",
    "bg-lime-zest",
  ];

  const [likedSongs, setLikedSongs] = useState<number[]>([]);

  const toggleLike = (id: number) => {
    setLikedSongs((prev) =>
      prev.includes(id)
        ? prev.filter((songId) => songId !== id)
        : [...prev, id],
    );
  };

  const formatViews = (views: number) => {
    if (!views) return "0";
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${Math.floor(views / 1000)}K`;
    return views.toString();
  };

  // Type guard helper: Kiểm tra xem item hiện tại có phải là Album không
  const isAlbum = (item: SongMinimal | Album): item is Album => {
    return "songs_detail" in item;
  };

  return (
    <div className="w-full bg-snow border-2 border-charcoal-ink rounded-lpalo p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      {/* HEADER & SWITCH TABS CONTROLLER */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6 border-b-2 border-charcoal-ink border-dashed pb-5">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-orange border-2 border-charcoal-ink rounded-full text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-alfa text-2xl md:text-3xl tracking-tight leading-none">
              MelodyHub Charts<span className="text-ember-orange">.</span>
            </h2>
            <p className="text-xs font-bold mt-1 text-gray-500 uppercase tracking-wider">
              Cập nhật trực tiếp theo thời gian thực
            </p>
          </div>
        </div>

        {/* NEO-BRUTALISM SWITCH TAB BUTTONS */}
        <div className="flex bg-peach-paper/40 p-1.5 border-2 border-charcoal-ink rounded-lpalo gap-1.5 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab("trending")}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 text-xs font-black uppercase rounded-lpalo-sm border-2 transition-all active:scale-95 ${
              activeTab === "trending"
                ? "bg-lime-zest border-charcoal-ink text-charcoal-ink shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                : "bg-transparent border-transparent text-gray-600 hover:text-charcoal-ink"
            }`}
          >
            <Flame className="w-3.5 h-3.5 fill-current" /> Xu hướng 7 ngày
          </button>
          <button
            onClick={() => setActiveTab("albums")}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 text-xs font-black uppercase rounded-lpalo-sm border-2 transition-all active:scale-95 ${
              activeTab === "albums"
                ? "bg-powder-blue border-charcoal-ink text-charcoal-ink shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                : "bg-transparent border-transparent text-gray-600 hover:text-charcoal-ink"
            }`}
          >
            <AlbumIcon className="w-3.5 h-3.5" /> Album Phổ biến
          </button>
        </div>
      </div>

      {/* DANH SÁCH BẢNG XẾP HẠNG */}
      <div className="flex flex-col gap-3 min-h-[300px] relative">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center font-bold text-sm uppercase text-gray-500">
            Đang tải dữ liệu bảng xếp hạng...
          </div>
        ) : chartSongs && chartSongs.length > 0 ? (
          chartSongs.map((item, index) => {
            const rank = index + 1;
            const assignedColor = crayonColors[index % crayonColors.length];
            const isLiked = likedSongs.includes(item.id);

            const isTop3 = rank <= 3;
            const rankBadgeColor =
              rank === 1
                ? "bg-amber-orange text-black"
                : rank === 2
                  ? "bg-lilac-tint text-charcoal-ink"
                  : rank === 3
                    ? "bg-mint-wash text-charcoal-ink"
                    : "bg-snow text-gray-400";

            // Phân tách thuộc tính hiển thị động dựa vào kiểu dữ liệu thực tế
            const displayTitle = item.title;
            const displayCover = item.cover_image_url || "";

            let displaySubText = "";
            let displayMeta = "";
            let targetPlayData: any = item;

            if (isAlbum(item)) {
              // Xử lý Render cho dòng dữ liệu Album
              displaySubText = item.artist_detail?.name || "Nghệ sĩ ẩn danh";
              displayMeta = `💿 ${item.songs_detail?.length || 0} bài hát`;

              // Khi phát Album, ưu tiên gán truyền bài hát đầu tiên trong Album đó cho trình phát nhạc
              targetPlayData = item.songs_detail?.[0] || item;
            } else {
              // Xử lý Render cho dòng dữ liệu SongMinimal thông thường
              displaySubText = `Professional 🎧 ${formatViews(item.views_count || 100000 - item.id * 8000)}`;
              displayMeta = `Thời lượng: ${item.duration_formatted}`;
            }

            return (
              <div
                key={`${activeTab}-${item.id}`}
                className="group flex items-center justify-between p-3 border-2 border-charcoal-ink rounded-lpalo transition-all hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-snow"
              >
                {/* TRÁI: THỨ HẠNG + ẢNH + THÔNG TIN */}
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  <div
                    className={`w-12 h-12 border-2 border-charcoal-ink rounded-lpalo-sm flex items-center justify-center font-alfa text-xl shrink-0 ${rankBadgeColor} shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]`}
                  >
                    {rank < 10 ? `0${rank}` : rank}
                  </div>

                  <div className="w-12 h-12 rounded-lpalo-sm border-2 border-charcoal-ink overflow-hidden shrink-0 bg-gray-100 relative shadow-sm">
                    <img
                      src={displayCover}
                      alt={displayTitle}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=100";
                      }}
                    />
                    <button
                      onClick={() => onPlaySong && onPlaySong(targetPlayData)}
                      className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Play className="w-5 h-5 text-snow fill-snow" />
                    </button>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm truncate text-charcoal-ink group-hover:text-ember-orange transition-colors">
                        {displayTitle}
                      </h4>
                      {isTop3 && (
                        <span className="text-[9px] font-black uppercase px-1.5 py-0.5 border border-charcoal-ink rounded-lpalo-sm bg-sunbeam-yellow text-charcoal-ink animate-pulse">
                          TOP
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500 font-medium mt-0.5">
                      <span>{displaySubText}</span>
                      <span>•</span>
                      <span>{displayMeta}</span>
                    </div>
                  </div>
                </div>

                {/* PHẢI: TAG CRAYON & ĐIỀU KHIỂN CHƠI NHẠC */}
                <div className="flex items-center gap-3 shrink-0 ml-4">
                  <span
                    className={`hidden md:block text-[10px] font-black uppercase border border-charcoal-ink px-2.5 py-1 rounded-lpalo-sm ${assignedColor}`}
                  >
                    {isAlbum(item) ? "Album" : "Đơn khúc"}
                  </span>

                  <button
                    onClick={() => toggleLike(item.id)}
                    className={`p-2 border-2 rounded-full transition-colors ${
                      isLiked
                        ? "bg-amber-orange border-charcoal-ink text-black shadow-sm"
                        : "bg-transparent border-transparent hover:border-charcoal-ink hover:bg-peach-paper/30 text-gray-400 hover:text-charcoal-ink"
                    }`}
                  >
                    <Heart
                      className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`}
                    />
                  </button>

                  <button
                    onClick={() => onPlaySong && onPlaySong(targetPlayData)}
                    className="p-2 bg-sunbeam-yellow border-2 border-charcoal-ink rounded-lpalo active:translate-y-0.5 transition-transform shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                    title={isAlbum(item) ? "Phát Album" : "Phát nhạc"}
                  >
                    <Play className="w-4 h-4 fill-charcoal-ink" />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="absolute inset-0 flex items-center justify-center font-bold text-sm uppercase text-gray-400">
            Không tìm thấy dữ liệu nào trong bảng xếp hạng này.
          </div>
        )}
      </div>
    </div>
  );
}
