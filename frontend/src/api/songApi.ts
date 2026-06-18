import { fetchClient } from "./fetch";
import type { Album, Playlist, SongMinimal } from "./types";

const songApi = {
  getPlaylistByUserId(userId: number): Promise<Playlist> {
    return fetchClient<Playlist>(`/playlists/${userId}`, {
      method: "GET",
    });
  },
};
export const chartApi = {
  get7DaysTrending(): Promise<SongMinimal[]> {
    return fetchClient<SongMinimal[]>(`/charts/top-songs/`, {
      method: "GET",
    });
  },
  getTopAlbums(): Promise<Album[]> {
    return fetchClient<Album[]>(`/charts/top-albums/`, {
      method: "GET",
    });
  },
};
export default songApi;
