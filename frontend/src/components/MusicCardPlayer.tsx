import { useState, useEffect, useRef, useCallback } from "react";
import {
  SkipBack,
  Play,
  Pause,
  SkipForward,
  Download,
  Forward,
  ListMusic,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import type { Playlist, Song } from "../api/types";
import songApi from "../api/songApi";

export default function MusicCardPlayer({
  userId,
}: {
  userId?: number | null;
}) {
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [loading, setLoading] = useState(userId ? true : false);
  const [error, setError] = useState<string | null>(null);

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

  const defaultSong = {
    id: 0,
    title: "Chưa chọn bài hát",
    artist_detail: { name: "Vui lòng đăng nhập" },
    duration_formatted: "0:00",
    audio_file_url: "",
    cover_image_url:
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=100",
  } as Song;

  const activeSong = currentSong || defaultSong;

  const fetchPlaylistData = useCallback(async () => {
    if (!userId) return;
    try {
      setLoading(true);
      const res = songApi.getPlaylistByUserId(userId);
      if (!res) throw new Error("Không thể tải danh sách phát");
      const data: Playlist = await res;
      setPlaylist(data);
      if (data.songs_detail && data.songs_detail.length > 0) {
        setCurrentSong(data.songs_detail[0]);
      }
      setLoading(false);
    } catch (err: any) {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    console.log("playlist data userId: ", userId);
    if (userId) fetchPlaylistData();
    else return;
  }, [userId, fetchPlaylistData]);

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

  if (loading) return null; // Ẩn thanh phát nhạc khi đang tải dữ liệu

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-snow border-t-4 border-charcoal-ink px-4 py-3 md:px-8 flex flex-col gap-2 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
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
          PLAYLIST POPUP PANEL (Mở ngược lên trên)
          ========================================== */}
      {userId && !error && playlist && isPlaylistExpanded && (
        <div className="absolute bottom-full right-4 md:right-8 mb-2 w-full max-w-sm bg-snow border-2 border-charcoal-ink rounded-lpalo p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] max-h-72 overflow-y-auto custom-scrollbar">
          <div className="flex justify-between items-center mb-3 pb-2 border-b-2 border-dashed border-charcoal-ink">
            <span className="font-alfa text-sm tracking-tight">
              Danh sách phát ({playlist.songs_detail.length})
            </span>
            <button
              onClick={() => setIsPlaylistExpanded(false)}
              className="text-xs font-bold underline"
            >
              Đóng
            </button>
          </div>
          <div className="space-y-2">
            {playlist.songs_detail.map((song, index) => {
              const assignedColor = crayonColors[index % crayonColors.length];
              const isSelected = currentSong?.id === song.id;

              return (
                <div
                  key={song.id}
                  onClick={() => {
                    setCurrentSong(song);
                    setIsPlaying(true);
                  }}
                  className={`flex items-center justify-between p-2 border-2 rounded-lpalo cursor-pointer transition-all ${
                    isSelected
                      ? "border-charcoal-ink bg-sunbeam-yellow/40 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                      : "border-gray-200 bg-snow hover:border-charcoal-ink hover:bg-peach-paper/20"
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <img
                      src={song.cover_image_url || ""}
                      alt={song.title}
                      className="w-8 h-8 rounded-lpalo-sm border border-charcoal-ink object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <h4
                        className={`text-xs font-bold truncate ${isSelected ? "text-ember-orange" : "text-charcoal-ink"}`}
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
                      className={`text-[9px] font-black border border-charcoal-ink px-1.5 py-0.5 rounded-lpalo-sm ${assignedColor}`}
                    >
                      {song.duration_formatted}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ==========================================
          MAIN HORIZONTAL BAR LAYOUT
          ========================================== */}
      <div className="flex items-center justify-between gap-4 w-full">
        {/* KHU VỰC TRÁI: THÔNG TIN BÀI HÁT */}
        <div className="flex items-center gap-3 w-1/3 min-w-[180px]">
          <div className="w-12 h-12 rounded-lpalo-sm border-2 border-charcoal-ink overflow-hidden shrink-0 bg-powder-blue relative">
            <img
              src={activeSong.cover_image_url || ""}
              alt={activeSong.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-magenta-pop/10 to-transparent pointer-events-none"></div>
          </div>
          <div className="min-w-0 hidden sm:block">
            <h4 className="font-bold text-sm tracking-tight truncate text-charcoal-ink">
              {activeSong.title}
            </h4>
            <p className="text-xs font-medium text-gray-500 truncate">
              {activeSong.artist_detail?.name}
            </p>
          </div>
          {/* Nút chức năng phụ ẩn trên mobile để gọn */}
          <div className="hidden lg:flex items-center gap-1 ml-2">
            {activeSong.audio_file_url ? (
              <a
                href={activeSong.audio_file_url}
                download
                target="_blank"
                rel="noreferrer"
                className="p-1.5 border-2 border-transparent hover:border-charcoal-ink rounded-lpalo-sm bg-peach-paper/40 transition-colors"
                title="Tải về"
              >
                <Download className="w-3.5 h-3.5 text-charcoal-ink" />
              </a>
            ) : (
              <button disabled className="p-1.5 opacity-30 cursor-not-allowed">
                <Download className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={() =>
                navigator.clipboard.writeText(window.location.href)
              }
              className="p-1.5 border-2 border-transparent hover:border-charcoal-ink rounded-lpalo-sm bg-peach-paper/40 transition-colors"
              title="Chia sẻ"
            >
              <Forward className="w-3.5 h-3.5 text-charcoal-ink" />
            </button>
          </div>
        </div>

        {/* KHU VỰC GIỮA: TRÌNH ĐIỀU KHIỂN & TIẾN TRÌNH */}
        <div className="flex flex-col items-center gap-1 flex-1 max-w-xl">
          {/* Bộ nút điểu khiển */}
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrevSong}
              disabled={!playlist}
              className="p-1 hover:bg-peach-paper/50 border border-transparent hover:border-charcoal-ink rounded-full transition-all disabled:opacity-30"
            >
              <SkipBack className="w-4 h-4 fill-charcoal-ink" />
            </button>
            <button
              onClick={togglePlay}
              disabled={!activeSong.audio_file_url}
              className="w-9 h-9 bg-sunbeam-yellow border-2 border-charcoal-ink rounded-full flex items-center justify-center active:translate-y-0.5 transition-transform shadow-sm disabled:opacity-50"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 fill-charcoal-ink" />
              ) : (
                <Play className="w-4 h-4 fill-charcoal-ink ml-0.5" />
              )}
            </button>
            <button
              onClick={handleNextSong}
              disabled={!playlist}
              className="p-1 hover:bg-peach-paper/50 border border-transparent hover:border-charcoal-ink rounded-full transition-all disabled:opacity-30"
            >
              <SkipForward className="w-4 h-4 fill-charcoal-ink" />
            </button>
          </div>

          {/* Thanh Tiến Trình Ngang */}
          <div className="w-full flex items-center gap-2 text-[11px] font-bold text-gray-500">
            <span className="w-8 text-right">{formatTime(currentTime)}</span>
            <div
              onClick={handleProgressClick}
              className="flex-1 h-2 bg-peach-paper border border-charcoal-ink rounded-lpalo overflow-hidden relative cursor-pointer"
            >
              <div
                className="h-full bg-ember-orange border-r border-charcoal-ink transition-all duration-100 ease-linear"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="w-8">
              {activeSong.duration_formatted || formatTime(duration)}
            </span>
          </div>
        </div>

        {/* KHU VỰC PHẢI: NÚT DANH SÁCH PHÁT (PLAYLIST) */}
        <div className="w-1/3 flex justify-end items-center shrink-0">
          {userId && playlist && (
            <button
              onClick={() => setIsPlaylistExpanded(!isPlaylistExpanded)}
              className={`flex items-center gap-1.5 py-1.5 px-3 border-2 border-charcoal-ink rounded-lpalo text-xs font-bold transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
                isPlaylistExpanded
                  ? "bg-mint-wash"
                  : "bg-peach-paper/30 hover:bg-peach-paper/70"
              }`}
            >
              <ListMusic className="w-4 h-4" />
              <span className="hidden md:inline">Danh sách</span>
              {isPlaylistExpanded ? (
                <ChevronDown className="w-3.5 h-3.5" />
              ) : (
                <ChevronUp className="w-3.5 h-3.5" />
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
