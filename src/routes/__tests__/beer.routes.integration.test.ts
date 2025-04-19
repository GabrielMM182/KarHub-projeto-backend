import request from 'supertest';
import { Beer } from '../../models/Beer.schema';
import app from '../../server'; 
import * as SpotifyService from '../../services/SpotifyService';

describe('Beer API - Integration', () => {
  beforeEach(async () => {
    await Beer.deleteMany({});
  });

  describe('POST /beers', () => {
    it('should create valid beer', async () => {
      const res = await request(app).post('/beers').send({ name: 'Pilsen', minTemp: 4, maxTemp: 6 });
      expect(res.status).toBe(201);
      expect(res.body.name).toBe('Pilsen');
    });
    it('should return 400 for invalid data (missing name field)', async () => {
      const res = await request(app).post('/beers').send({ minTemp: 2, maxTemp: 8 });
      expect(res.status).toBe(400);
    });
    it('should return 400 for invalid data (minTemp > maxTemp)', async () => {
      const res = await request(app).post('/beers').send({ name: 'Ale', minTemp: 10, maxTemp: 6 });
      expect(res.status).toBe(400);
    });
  });

  describe('GET /beers', () => {
    it('should return registered beers', async () => {
      await Beer.create({ name: 'Lager', minTemp: 2, maxTemp: 4 });
      const res = await request(app).get('/beers');
      expect(res.status).toBe(200);
      expect(res.body.some((b: any) => b.name === 'Lager')).toBe(true);
    });
  });

  describe('GET /beers/:id', () => {
    it('should return existing beer', async () => {
      const resPost = await request(app).post('/beers').send({ name: 'IPA', minTemp: 6, maxTemp: 8 });
      const beerId = resPost.body._id || resPost.body.id;
      const res = await request(app).get(`/beers/${beerId}`);
      expect(res.status).toBe(200);
      expect(res.body.name).toBe('IPA');
    });
    it('should return 404 for non-existent id', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const res = await request(app).get(`/beers/${fakeId}`);
      expect(res.status).toBe(404);
    });
  });

  describe('PUT /beers/:id', () => {
    it('should update existing beer', async () => {
      const resPost = await request(app).post('/beers').send({ name: 'Stout', minTemp: 7, maxTemp: 9 });
      const beerId = resPost.body._id || resPost.body.id;
      const res = await request(app)
        .put(`/beers/${beerId}`)
        .send({ name: 'Stout Extra', minTemp: 7, maxTemp: 10 });
      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Stout Extra');
      expect(res.body.maxTemp).toBe(10);
    });
    it('should return 400 for invalid data (minTemp > maxTemp)', async () => {
      const resPost = await request(app).post('/beers').send({ name: 'Stout', minTemp: 7, maxTemp: 9 });
      const beerId = resPost.body._id || resPost.body.id;
      const res = await request(app)
        .put(`/beers/${beerId}`)
        .send({ name: 'Stout', minTemp: 12, maxTemp: 8 });
      expect(res.status).toBe(400);
    });
    it('should return 404 for non-existent id', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const res = await request(app)
        .put(`/beers/${fakeId}`)
        .send({ name: 'Stout', minTemp: 7, maxTemp: 9 });
      expect(res.status).toBe(404);
    });
  });

  describe('DELETE /beers/:id', () => {
    it('should delete existing beer', async () => {
      const resPost = await request(app).post('/beers').send({ name: 'Witbier', minTemp: 3, maxTemp: 6 });
      const beerId = resPost.body._id || resPost.body.id;
      const res = await request(app).delete(`/beers/${beerId}`);
      expect(res.status).toBe(204);
      const found = await Beer.findById(beerId);
      expect(found).toBeNull();
    });
    it('should return 404 for non-existent id', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const res = await request(app).delete(`/beers/${fakeId}`);
      expect(res.status).toBe(404);
    });
  });

  describe('POST /beers/recommendation', () => {
    beforeEach(() => {
      jest.spyOn(SpotifyService, 'searchPlaylist').mockResolvedValue({ name: 'Playlist', tracks: [] } as any);
    });
    it('should recommend correct beer style and playlist', async () => {
      await Beer.create({ name: 'Weiss', minTemp: 5, maxTemp: 8 });
      const res = await request(app).post('/beers/recommendation').send({ temperature: 6 });
      expect(res.status).toBe(200);
      expect(res.body.beerStyle).toBe('Weiss');
      expect(res.body.playlist).toBeTruthy();
    });
    it('should return 200 and message when no beer style is registered for the temperature', async () => {
      const res = await request(app).post('/beers/recommendation').send({ temperature: -10 });
      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        beerStyle: null,
        playlist: { message: 'No beer style found for this temperature.' }
      });
    });
    it('should return 400 for invalid body', async () => {
      const res = await request(app).post('/beers/recommendation').send({ temp: 5 });
      expect(res.status).toBe(400);
    });
  });
});