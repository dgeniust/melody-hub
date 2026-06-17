import { useCallback, useEffect, useState } from "react";
import { ListMusic, Heart, User } from "lucide-react";
import type { Playlist } from "../api/types";

export default function UserPlaylist() {
  // Giả lập dữ liệu nhận được từ JSON API cấp phát của bạn
  const [playlist, setPlaylist] = useState<Playlist | null>();
  const handlePlaylist = useCallback(async () => {
    fetch("http://127.0.0.1:8000/api/playlists/1/")
      .then((res) => {
        if (!res.ok) throw new Error("Không thể tải bài hát");
        return res.json();
      })
      .then((data) => {
        setPlaylist(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  useEffect(() => {
    handlePlaylist();
  }, []);
  // Mảng màu sắc luân phiên cho thẻ tag theo style của Lpalo
  const crayonColors = [
    "bg-mint-wash",
    "bg-lilac-tint",
    "bg-sunbeam-yellow",
    "bg-powder-blue",
    "bg-lime-zest",
  ];

  return (
    <div className="w-full space-y-2 max-w-sm mx-auto bg-snow border-2 border-charcoal-ink rounded-lpalo p-6 flex flex-col gap-5">
      {/* Header của Playlist Card */}
      <div className="flex items-center justify-between border-b-2 border-charcoal-ink border-dashed pb-3 mb-4">
        <div className="flex items-center gap-2">
          <ListMusic className="w-5 h-5 text-ember-orange stroke-[2.5]" />
          <h3 className="font-alfa text-base tracking-tight">
            {playlist?.title}
          </h3>
        </div>
        <span className="text-[10px] bg-sunbeam-yellow border border-charcoal-ink px-2 py-0.5 font-bold rounded-lpalo-sm">
          {playlist?.songs.length} bài hát
        </span>
      </div>

      {/* Thông tin mô tả danh sách phát */}
      <div className="mb-4 bg-peach-paper/40 p-3 border border-charcoal-ink rounded-lpalo-sm">
        <p className="text-xs font-semibold text-gray-700 leading-normal">
          {playlist?.description}
        </p>
        <div className="flex items-center gap-1 mt-2 text-[10px] font-bold text-gray-500">
          <User className="w-3 h-3" />
          <span>Tạo bởi: @{playlist?.user_detail.username}</span>
        </div>
      </div>

      {/* Danh sách cuộn chứa các bài hát (Tracks) */}
      <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1 scrollbar-none">
        {playlist?.songs_detail.map((song, index) => {
          // Lấy màu ngẫu nhiên từ bảng crayon tokens
          const assignedColor = crayonColors[index % crayonColors.length];

          return (
            <div
              key={song.id}
              className="group p-2.5 border-2 border-charcoal-ink rounded-lpalo flex items-center justify-between gap-3 bg-snow hover:bg-peach-paper/20 transition-colors cursor-pointer"
            >
              {/* Khối chứa ảnh cover và tiêu đề */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-11 h-11 border border-charcoal-ink rounded-lpalo-sm overflow-hidden shrink-0 relative bg-gray-100">
                  <img
                    src={song.cover_image_url || ""}
                    alt={song.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Thay thế nếu ảnh bị lỗi URL example.com
                      e.currentTarget.src =
                        "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=100&auto=format&fit=crop&q=60";
                    }}
                  />
                </div>

                <div className="min-w-0">
                  <h4 className="font-bold text-xs truncate text-charcoal-ink group-hover:text-ember-orange transition-colors">
                    {song.title}
                  </h4>
                  <p className="text-[11px] font-medium text-gray-500 truncate mt-0.5">
                    {song.artist_detail.name}
                  </p>
                </div>
              </div>

              {/* Khối chứa badge thời gian và icon tương tác */}
              <div className="flex items-center gap-2 shrink-0">
                <span
                  className={`text-[9px] font-black uppercase border border-charcoal-ink px-1.5 py-0.5 rounded-lpalo-sm ${assignedColor}`}
                >
                  {song.duration_formatted}
                </span>
                <button className="p-1 bg-transparent hover:bg-peach-paper border border-transparent hover:border-charcoal-ink rounded-full transition-colors">
                  <Heart className="w-3 h-3 text-gray-400 hover:text-ember-orange" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
