import { searchPlaylist } from '../SpotifyService';
import axios from 'axios';
import type { AxiosResponse } from 'axios';
import { AxiosHeaders } from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('SpotifyService', () => {
  describe('searchPlaylist', () => {
    it('deve retornar a playlist esperada', async () => {
      const mockResponse: AxiosResponse = {
        data: { playlists: { items: [{ name: 'Playlist', tracks: [] }] } },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: { headers: new AxiosHeaders() }
      };
      mockedAxios.get.mockResolvedValueOnce(mockResponse);
      const playlist = await searchPlaylist('rock', 'token');
      expect(playlist).toEqual({ name: 'Playlist', tracks: [] });
    });
    it('deve retornar null se não encontrar playlists', async () => {
      const emptyResponse: AxiosResponse = {
        data: { playlists: { items: [] } },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: { headers: new AxiosHeaders(), url: '', method: 'get' }
      };
      mockedAxios.get.mockResolvedValueOnce(emptyResponse);
      const playlist = await searchPlaylist('abc', 'token');
      expect(playlist).toBeNull();
    });
    it('deve retornar null em caso de erro', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('erro'));
      const playlist = await searchPlaylist('token', 'rock');
      expect(playlist).toBeNull();
    });
  });
});
