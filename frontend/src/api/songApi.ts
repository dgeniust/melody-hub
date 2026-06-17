import { fetchClient } from "./fetch";
import type { Playlist } from "./types";

const songApi = {
  getPlaylistByUserId(userId: number): Promise<Playlist> {
    return fetchClient<Playlist>(`/playlists/${userId}`, {
      method: "GET",
    });
  },
};
export default songApi;
