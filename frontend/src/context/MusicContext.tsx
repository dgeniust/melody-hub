import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import type { Album, Playlist, Song, SongMinimal } from "../api/types";
import songApi from "../api/songApi";

interface MusicContextType {
  playlist: Playlist | Album | null;
  currentSong: Song | SongMinimal | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  loading: boolean;
  playSong: (
    song: Song | SongMinimal,
    customPlaylist?: Playlist | Album,
  ) => void;
  setGlobalPlaylist: (playlist: Playlist | Album) => void;
  togglePlay: () => void;
  handleNextSong: () => void;
  handlePrevSong: () => void;
  seek: (time: number) => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export function MusicProvider({
  children,
  userId,
}: {
  children: ReactNode;
  userId: number | null;
}) {
  const [playlist, setPlaylist] = useState<Playlist | Album | null>(null);
  const [currentSong, setCurrentSong] = useState<Song | SongMinimal | null>(
    null,
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loading, setLoading] = useState(!!userId);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Tải danh sách mặc định của user khi khởi tạo
  useEffect(() => {
    async function fetchDefaultPlaylist() {
      if (!userId) return;
      try {
        setLoading(true);
        const data = await songApi.getPlaylistByUserId(userId);
        if (data && data.songs_detail?.length > 0) {
          setPlaylist(data);
          setCurrentSong(data.songs_detail[0]);
        }
      } catch (err) {
        console.error("Lỗi tải playlist mặc định:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchDefaultPlaylist();
  }, [userId]);

  // Khởi tạo Audio Element chạy ngầm toàn cục
  useEffect(() => {
    audioRef.current = new Audio();

    const audio = audioRef.current;
    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration);
    const onEnded = () => handleNextSong();

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.pause();
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("ended", onEnded);
    };
  }, [playlist, currentSong]); // Re-bind listener khi playlist hoặc song thay đổi để chạy đúng logic next bài

  // Tự động load và chạy khi đổi bài hát
  useEffect(() => {
    if (audioRef.current && currentSong?.audio_file_url) {
      audioRef.current.src = currentSong.audio_file_url;
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current
          .play()
          .catch((err) => console.log("Playback error:", err));
      }
    }
  }, [currentSong]);

  // Hàm phát 1 bài cụ thể (và có thể đổi luôn playlist nếu truyền vào)
  const playSong = (
    song: Song | SongMinimal,
    customPlaylist?: Playlist | Album,
  ) => {
    if (customPlaylist) {
      setPlaylist(customPlaylist);
    }
    setCurrentSong(song);
    setIsPlaying(true);
    audioRef.current?.play().catch((err) => console.log(err));
  };

  const setGlobalPlaylist = (newPlaylist: Playlist | Album) => {
    setPlaylist(newPlaylist);
    if (newPlaylist.songs_detail?.length > 0) {
      setCurrentSong(newPlaylist.songs_detail[0]);
    }
  };

  const togglePlay = () => {
    if (!audioRef.current || !currentSong?.audio_file_url) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.log(err));
    }
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

  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  return (
    <MusicContext.Provider
      value={{
        playlist,
        currentSong,
        isPlaying,
        currentTime,
        duration,
        loading,
        playSong,
        setGlobalPlaylist,
        togglePlay,
        handleNextSong,
        handlePrevSong,
        seek,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
}

// Custom hook để dùng ở mọi nơi
export function useMusic() {
  const context = useContext(MusicContext);
  if (!context) throw new Error("useMusic phải được bọc trong MusicProvider");
  return context;
}
