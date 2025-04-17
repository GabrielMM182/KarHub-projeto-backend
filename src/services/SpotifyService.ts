import axios from 'axios';

const SPOTIFY_SEARCH_URL = 'https://api.spotify.com/v1/search';

import {
  SpotifyPlaylistResult,
  SpotifySearchApiResponse,
  SpotifyPlaylistApiResponse,
  SpotifyPlaylistTrack
} from '../types/SpotifyService.types';

import { logger } from '../utils/logger';

export async function searchPlaylist(query: string, token: string): Promise<SpotifyPlaylistResult | null> {

  logger.info({ query }, 'Buscando playlist no Spotify');
  try {
    const searchResponse = await axios.get<SpotifySearchApiResponse>(SPOTIFY_SEARCH_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        q: query,
        type: 'playlist',
        limit: 5,
      },
    });
    const items = searchResponse.data.playlists?.items;
    if (!items || items.length === 0) {
      logger.warn({ query }, 'Nenhuma playlist encontrada no Spotify');
      return null;
    }
    const playlist = items[0];
    logger.info({ query, playlist: playlist.name }, 'Playlist encontrada no Spotify');

    const tracksUrl = `https://api.spotify.com/v1/playlists/${playlist.id}/tracks?limit=5`;
    let tracks: SpotifyPlaylistTrack[] = [];
    try {
      const tracksResponse = await axios.get<SpotifyPlaylistApiResponse>(tracksUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      tracks = tracksResponse.data.items
        .map(item => {
          if (!item.track) return null;
          return {
            name: item.track.name,
            artist: item.track.artists?.[0]?.name || '',
            url: item.track.external_urls?.spotify || '',
          };
        })
        .filter(Boolean) as SpotifyPlaylistTrack[];
      logger.info({ playlist: playlist.name, tracksCount: tracks.length }, 'Tracks da playlist obtidas com sucesso');
    } catch (trackErr) {
      logger.error({ playlist: playlist.name, trackErr }, 'Erro ao buscar tracks da playlist');
    }

    return {
      name: playlist.name,
      tracks,
    };

  } catch (error) {
    logger.error({ query, error }, 'Erro ao buscar playlist no Spotify');
    return null;
  }
}
