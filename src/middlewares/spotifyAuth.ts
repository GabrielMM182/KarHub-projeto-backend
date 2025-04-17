import { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } from '../config/env';

async function fetchSpotifyToken(): Promise<string> {
  const credentials = Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64');
  const response = await axios.post<{ access_token: string; expires_in: number }>(
    'https://accounts.spotify.com/api/token',
    'grant_type=client_credentials',
    {
      headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );
  return response.data.access_token;
}

export async function spotifyAuth(_: Request, res: Response, next: NextFunction) {
  try {
    const token = await fetchSpotifyToken();
    res.locals.spotifyToken = token;
    next();
  } catch (error) {
    res.locals.spotifyToken = null;
    next();
  }
}
