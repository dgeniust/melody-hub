type ID = number;

// === 1. User & Authentication ===
export interface UserMinified {
  id: ID;
  username: string;
}

// Dữ liệu nhận vào khi đăng ký thành công (hoặc gửi lên)
export interface RegisterData {
  username: string;
  email: string;
  // password chỉ dùng khi gửi lên (write_only), không có trong dữ liệu trả về
}

// === 2. Core Music Entities ===
export interface Artist {
  id: ID;
  name: string;
  bio?: string | null;
  avatar_url?: string | null;
  verified: boolean;
  followers: number;
}

export interface Genre {
  id: ID;
  name: string;
  description?: string | null;
}

export interface Album {
  id: ID;
  title: string;
  artist: ID; // Dùng cho write/id thuần túy
  artist_detail: Artist; // Được sinh ra từ `ArtistSerializer(source='artist')`
  cover_image_url?: string | null;
  release_date?: string | null; // Định dạng "YYYY-MM-DD"
  created_at: string; // ISO String Datetime
}

export interface Song {
  id: ID;
  title: string;
  artist_name: ID; // FK ID gửi lên hoặc trả về (tương ứng trường artist_name)
  artist_detail: Artist; // Chi tiết nghệ sĩ dạng object
  duration: number; // Tính bằng giây
  duration_formatted: string; // Định dạng "MM:SS" từ SerializerMethodField
  audio_file_url: string;
  cover_image_url?: string | null;
  created_at: string;
}

// === 3. User Interactions (Playlist & Favorites) ===
export interface Playlist {
  id: ID;
  user: ID; // ID của User sở hữu playlist
  user_detail: UserMinified; // Thông tin gọn nhẹ của User sở hữu
  title: string;
  description?: string | null;
  cover_image_url?: string | null;
  is_public: boolean;
  songs: ID[]; // Mảng các ID bài hát (khi chỉnh sửa/gửi lên)
  songs_detail: Song[]; // Mảng chứa thông tin chi tiết bài hát để hiển thị ở UI
  created_at: string;
}

export interface FavoriteSong {
  id: ID;
  user: ID;
  song: ID; // ID bài hát được thích
  song_detail: Song; // Chi tiết bài hát để render ra danh sách yêu thích
  liked_at: string;
}
