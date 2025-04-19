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
    it('retorna 400 para dados inválidos (ausência do campo name)', async () => {
      const res = await request(app).post('/beers').send({ minTemp: 2, maxTemp: 8 });
      expect(res.status).toBe(400);
    });
    it('retorna 400 para dados inválidos (minTemp > maxTemp )', async () => {
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

  describe('GET /beers/:id', () => {
    it('retorna cerveja existente', async () => {
      const resPost = await request(app).post('/beers').send({ name: 'IPA', minTemp: 6, maxTemp: 8 });
      const beerId = resPost.body._id || resPost.body.id;
      const res = await request(app).get(`/beers/${beerId}`);
      expect(res.status).toBe(200);
      expect(res.body.name).toBe('IPA');
    });
    it('retorna 404 para id inexistente', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const res = await request(app).get(`/beers/${fakeId}`);
      expect(res.status).toBe(404);
    });
  });

  describe('PUT /beers/:id', () => {
    it('atualiza cerveja existente', async () => {
      const resPost = await request(app).post('/beers').send({ name: 'Stout', minTemp: 7, maxTemp: 9 });
      const beerId = resPost.body._id || resPost.body.id;
      const res = await request(app)
        .put(`/beers/${beerId}`)
        .send({ name: 'Stout Extra', minTemp: 7, maxTemp: 10 });
      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Stout Extra');
      expect(res.body.maxTemp).toBe(10);
    });
    it('retorna 400 para dados inválidos (minTemp > maxTemp)', async () => {
      const resPost = await request(app).post('/beers').send({ name: 'Stout', minTemp: 7, maxTemp: 9 });
      const beerId = resPost.body._id || resPost.body.id;
      const res = await request(app)
        .put(`/beers/${beerId}`)
        .send({ name: 'Stout', minTemp: 12, maxTemp: 8 });
      expect(res.status).toBe(400);
    });
    it('retorna 404 para id inexistente', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const res = await request(app)
        .put(`/beers/${fakeId}`)
        .send({ name: 'Stout', minTemp: 7, maxTemp: 9 });
      expect(res.status).toBe(404);
    });
  });

  describe('DELETE /beers/:id', () => {
    it('remove cerveja existente', async () => {
      const resPost = await request(app).post('/beers').send({ name: 'Witbier', minTemp: 3, maxTemp: 6 });
      const beerId = resPost.body._id || resPost.body.id;
      const res = await request(app).delete(`/beers/${beerId}`);
      expect(res.status).toBe(204);
      const found = await Beer.findById(beerId);
      expect(found).toBeNull();
    });
    it('retorna 404 para id inexistente', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const res = await request(app).delete(`/beers/${fakeId}`);
      expect(res.status).toBe(404);
    });
  });

  describe('POST /beers/recommendation', () => {
    beforeEach(() => {
      jest.spyOn(SpotifyService, 'searchPlaylist').mockResolvedValue({ name: 'Playlist', tracks: [] } as any);
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