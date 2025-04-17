export interface SpotifyPlaylistTrack {
  name: string;
  artist: string;
  url: string;
}

export interface SpotifyPlaylistResult {
  name: string;
  tracks: SpotifyPlaylistTrack[];
}

export interface SpotifySearchApiTrack {
  name: string;
  artists: { name: string }[];
  external_urls: { spotify: string };
}

export interface SpotifySearchApiPlaylist {
  id: string;
  name: string;
}

export interface SpotifySearchApiResponse {
  playlists: {
    items: SpotifySearchApiPlaylist[];
  };
}

export interface SpotifyPlaylistApiResponse {
  items: {
    track: SpotifySearchApiTrack;
  }[];
}
