import { useState, useEffect, useRef, useCallback } from "react";
import {
  SkipBack,
  Play,
  Pause,
  SkipForward,
  Music,
  Download,
  Forward,
  ListMusic,
  Heart,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import type { Playlist, Song } from "../api/types";
import songApi from "../api/songApi";

// 1. Cho phép userId có thể là null hoặc undefined nếu không đăng nhập
export default function MusicCardPlayer({
  userId,
}: {
  userId?: number | null;
}) {
  // --- STATE QUẢN LÝ DỮ LIỆU ---
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);

  // Mặc định nếu không có userId thì không cần loading API bff
  const [loading, setLoading] = useState(userId ? true : false);
  const [error, setError] = useState<string | null>(null);

  // --- STATE QUẢN LÝ GIAO DIỆN & TRÌNH PHÁT ---
  const [isPlaylistExpanded, setIsPlaylistExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const crayonColors = [
    "bg-mint-wash",
    "bg-lilac-tint",
    "bg-sunbeam-yellow",
    "bg-powder-blue",
    "bg-lime-zest",
  ];

  // Mock một bài hát mặc định hiển thị khi user CHƯA ĐĂNG NHẬP
  const defaultSong = {
    id: 0,
    title: "Chưa chọn bài hát",
    artist_detail: {
      name: "Vui lòng đăng nhập",
    },
    duration_formatted: "0:00",
    audio_file_url: "",
    cover_image_url:
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400",
  } as Song; // Ép kiểu để TS không bắt bẻ các trường thiếu

  // Xác định bài hát hiển thị thực tế
  const activeSong = currentSong || defaultSong;
  console.log("test user id: ", userId);
  // Fetch Playlist từ API
  const fetchPlaylistData = useCallback(async () => {
    if (!userId) return; // Nếu không có userId thì thoát luôn không gọi API

    try {
      setLoading(true);
      const res = songApi.getPlaylistByUserId(userId);
      console.log("res playlist: ", JSON.stringify(res));
      if (!res) throw new Error("Không thể tải danh sách phát");
      const data: Playlist = await res;

      setPlaylist(data);
      if (data.songs_detail && data.songs_detail.length > 0) {
        setCurrentSong(data.songs_detail[0]);
      }
      setLoading(false);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchPlaylistData();
  }, [userId]);

  // Theo dõi đổi bài
  useEffect(() => {
    if (audioRef.current && activeSong.audio_file_url) {
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current
          .play()
          .catch((err) => console.log("Playback error:", err));
      }
    }
  }, [activeSong.audio_file_url]);

  // Điều khiển Play/Pause
  const togglePlay = () => {
    if (!audioRef.current || !activeSong.audio_file_url) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      if (audioRef.current.readyState === 0) {
        audioRef.current.load();
      }
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.log("Playback error:", err));
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) setDuration(audioRef.current.duration);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || duration === 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const newTime = (clickX / width) * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleNextSong = () => {
    if (!playlist || !currentSong) return;
    const currentIndex = playlist.songs_detail.findIndex(
      (s) => s.id === currentSong.id,
    );
    const nextIndex = (currentIndex + 1) % playlist.songs_detail.length;
    setCurrentSong(playlist.songs_detail[nextIndex]);
    setIsPlaying(true);
  };

  const handlePrevSong = () => {
    if (!playlist || !currentSong) return;
    const currentIndex = playlist.songs_detail.findIndex(
      (s) => s.id === currentSong.id,
    );
    const prevIndex =
      (currentIndex - 1 + playlist.songs_detail.length) %
      playlist.songs_detail.length;
    setCurrentSong(playlist.songs_detail[prevIndex]);
    setIsPlaying(true);
  };

  const formatTime = (timeInSeconds: number) => {
    if (isNaN(timeInSeconds)) return "0:00";
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Di chuyển các đoạn chặn giao diện xuống dưới hoặc loại bỏ bớt để Card luôn hiển thị
  if (loading) {
    return (
      <div className="text-center py-4 font-bold">
        Đang tải trình phát nhạc...
      </div>
    );
  }

  return (
    <div className="w-full space-y-4 max-w-sm mx-auto bg-snow border-2 border-charcoal-ink rounded-lpalo p-6 flex flex-col gap-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      {/* Thẻ audio ẩn */}
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleNextSong}
        preload="auto"
      >
        {activeSong.audio_file_url && (
          <source src={activeSong.audio_file_url} type="audio/mpeg" />
        )}
      </audio>

      {/* ==========================================
          PHẦN 1: MUSIC CARD PLAYER (LUÔN HIỂN THỊ)
          ========================================== */}
      <div className="text-center">
        <span className="text-[11px] font-black tracking-widest text-gray-400 uppercase">
          {isPlaying ? "Đang phát" : "Đang dừng"}
        </span>
      </div>

      {/* Ảnh bìa */}
      <div
        className="w-full aspect-square bg-powder-blue border-2 border-charcoal-ink rounded-lpalo p-4 flex flex-col justify-between relative overflow-hidden group bg-cover bg-center"
        style={{ backgroundImage: `url(${activeSong.cover_image_url})` }}
      >
        <div className="flex justify-between items-start z-10">
          <span className="bg-snow border-2 border-charcoal-ink rounded-lpalo-sm text-[10px] font-bold px-2 py-0.5 shadow-sm">
            HQ Audio
          </span>
          <button className="p-1.5 bg-snow border-2 border-charcoal-ink rounded-full shadow-sm">
            <Music className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="z-10 bg-snow/90 backdrop-blur-sm p-3 border-2 border-charcoal-ink rounded-lpalo-sm shadow-sm">
          <h4 className="font-bold text-base tracking-tight truncate">
            {activeSong.title}
          </h4>
          <p className="text-xs font-bold text-gray-700 truncate">
            {activeSong.artist_detail?.name}
          </p>
        </div>
        <div className="absolute inset-0 bg-gradient-to-tr from-magenta-pop/20 to-transparent pointer-events-none"></div>
      </div>

      {/* Thanh tiến trình */}
      <div className="space-y-1.5">
        <div
          onClick={handleProgressClick}
          className="w-full h-3 bg-peach-paper border-2 border-charcoal-ink rounded-lpalo overflow-hidden relative cursor-pointer"
        >
          <div
            className="h-full bg-ember-orange border-r-2 border-charcoal-ink transition-all duration-100 ease-linear"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="flex justify-between text-xs font-bold text-gray-600">
          <span>{formatTime(currentTime)}</span>
          <span>{activeSong.duration_formatted || formatTime(duration)}</span>
        </div>
      </div>

      {/* Điều khiển phát nhạc */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={handlePrevSong}
          disabled={!playlist}
          className="p-2.5 bg-transparent border-2 border-transparent hover:border-charcoal-ink rounded-full transition-all active:scale-90 disabled:opacity-40 disabled:hover:border-transparent"
        >
          <SkipBack className="w-5 h-5 fill-charcoal-ink" />
        </button>

        <button
          onClick={togglePlay}
          disabled={!activeSong.audio_file_url}
          className="w-14 h-14 bg-sunbeam-yellow border-2 border-charcoal-ink rounded-full flex items-center justify-center active:translate-y-0.5 transition-transform shadow-md disabled:opacity-50"
        >
          {isPlaying ? (
            <Pause className="w-6 h-6 fill-charcoal-ink" />
          ) : (
            <Play className="w-6 h-6 fill-charcoal-ink ml-1" />
          )}
        </button>

        <button
          onClick={handleNextSong}
          disabled={!playlist}
          className="p-2.5 bg-transparent border-2 border-transparent hover:border-charcoal-ink rounded-full transition-all active:scale-90 disabled:opacity-40 disabled:hover:border-transparent"
        >
          <SkipForward className="w-5 h-5 fill-charcoal-ink" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2 border-t-2 border-charcoal-ink border-dashed pt-2">
        {activeSong.audio_file_url ? (
          <a
            href={activeSong.audio_file_url}
            download
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 py-2 border-2 border-charcoal-ink rounded-lpalo text-xs font-bold bg-peach-paper/40 hover:bg-peach-paper transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> Tải về
          </a>
        ) : (
          <button
            disabled
            className="flex items-center justify-center gap-2 py-2 border-2 border-gray-200 text-gray-400 rounded-lpalo text-xs font-bold bg-gray-100 cursor-not-allowed"
          >
            <Download className="w-3.5 h-3.5" /> Tải về
          </button>
        )}
        <button
          onClick={() => navigator.clipboard.writeText(window.location.href)}
          className="flex items-center justify-center gap-2 py-2 border-2 border-charcoal-ink rounded-lpalo text-xs font-bold bg-peach-paper/40 hover:bg-peach-paper transition-colors"
        >
          <Forward className="w-3.5 h-3.5" /> Chia sẻ
        </button>
      </div>

      {/* ==========================================
          PHẦN 2: USER PLAYLIST (CHỈ HIỆN KHI ĐÃ ĐĂNG NHẬP VÀ CÓ PLAYLIST)
          ========================================== */}
      {userId && !error && playlist && (
        <div className="border-t-2 border-charcoal-ink pt-2 mt-2">
          <button
            onClick={() => setIsPlaylistExpanded(!isPlaylistExpanded)}
            className="w-full flex items-center justify-between py-2 px-3 bg-peach-paper/30 hover:bg-peach-paper/70 border-2 border-charcoal-ink rounded-lpalo text-xs font-bold transition-all"
          >
            <div className="flex items-center gap-2">
              <ListMusic className="w-4 h-4 text-charcoal-ink" />
              <span>Danh sách phát ({playlist?.songs.length || 0})</span>
            </div>
            {isPlaylistExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>

          {isPlaylistExpanded && (
            <div className="mt-3 space-y-2 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
              {playlist?.songs_detail.map((song, index) => {
                const assignedColor = crayonColors[index % crayonColors.length];
                const isSelected = currentSong?.id === song.id;

                return (
                  <div
                    key={song.id}
                    onClick={() => {
                      setCurrentSong(song);
                      setIsPlaying(true);
                    }}
                    className={`flex items-center justify-between p-2 border-2 rounded-lpalo cursor-pointer group transition-all active:translate-y-0.5 ${
                      isSelected
                        ? "border-charcoal-ink bg-sunbeam-yellow/40 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                        : "border-gray-200 bg-snow hover:border-charcoal-ink hover:bg-peach-paper/20"
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-8 h-8 rounded-lpalo-sm border border-charcoal-ink overflow-hidden shrink-0 bg-gray-100">
                        <img
                          src={song.cover_image_url || ""}
                          alt={song.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src =
                              "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=100&auto=format&fit=crop&q=60";
                          }}
                        />
                      </div>
                      <div className="min-w-0">
                        <h4
                          className={`text-xs font-bold truncate transition-colors ${
                            isSelected
                              ? "text-ember-orange"
                              : "text-charcoal-ink group-hover:text-ember-orange"
                          }`}
                        >
                          {song.title}
                        </h4>
                        <p className="text-[10px] font-medium text-gray-500 truncate">
                          {song.artist_detail.name}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`text-[9px] font-black uppercase border border-charcoal-ink px-1.5 py-0.5 rounded-lpalo-sm ${assignedColor}`}
                      >
                        {song.duration_formatted}
                      </span>
                      <button
                        onClick={(e) => e.stopPropagation()}
                        className="p-1 bg-transparent hover:bg-peach-paper border border-transparent hover:border-charcoal-ink rounded-full transition-colors"
                      >
                        <Heart className="w-3 h-3 text-gray-400 hover:text-ember-orange" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Hiển thị thông báo lỗi nhỏ dưới cùng nếu API playlist lỗi nhưng không làm sập giao diện Card chính */}
      {error && (
        <p className="text-center text-xs text-red-500 font-bold">
          Không thể tải playlist: {error}
        </p>
      )}
    </div>
  );
}
