import request from 'supertest';
import { Beer } from '../../models/Beer.schema';
import app from '../../server'; 
import * as SpotifyService from '../../services/SpotifyService';

describe('Beer API - Integração', () => {
  beforeEach(async () => {
    await Beer.deleteMany({});
  });

  describe('POST /beers', () => {
    it('cria cerveja válida', async () => {
      const res = await request(app).post('/beers').send({ name: 'Pilsen', minTemp: 4, maxTemp: 6 });
      expect(res.status).toBe(201);
      expect(res.body.name).toBe('Pilsen');
    });
    it('retorna 400 para dados inválidos', async () => {
      const res = await request(app).post('/beers').send({ name: 'Ale', minTemp: 10, maxTemp: 6 });
      expect(res.status).toBe(400);
    });
  });

  describe('GET /beers', () => {
    it('retorna cervejas cadastradas', async () => {
      await Beer.create({ name: 'Lager', minTemp: 2, maxTemp: 4 });
      const res = await request(app).get('/beers');
      expect(res.status).toBe(200);
      expect(res.body.some((b: any) => b.name === 'Lager')).toBe(true);
    });
  });

  describe('POST /beers/recommendation', () => {
    beforeEach(() => {
      jest.spyOn(SpotifyService, 'searchPlaylist').mockResolvedValue({ name: 'Playlist', tracks: [] } as any); // Corrigir mock do SpotifyService para usar a tipagem correta
    });
    it('recomenda estilo correto e playlist', async () => {
      await Beer.create({ name: 'Weiss', minTemp: 5, maxTemp: 8 });
      const res = await request(app).post('/beers/recommendation').send({ temperature: 6 });
      expect(res.status).toBe(200);
      expect(res.body.beerStyle).toBe('Weiss');
      expect(res.body.playlist).toBeTruthy();
    });
    it('retorna 200 e mensagem quando não há estilo cadastrado para a temperatura', async () => {
      const res = await request(app).post('/beers/recommendation').send({ temperature: -10 });
      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        beerStyle: null,
        playlist: { message: 'Nenhum estilo de cerveja encontrado para essa temperatura.' }
      });
    });
    it('retorna 400 para corpo inválido', async () => {
      const res = await request(app).post('/beers/recommendation').send({ temp: 5 });
      expect(res.status).toBe(400);
    });
  });
});
