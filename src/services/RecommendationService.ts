import * as BeerService from './BeerService';
import { searchPlaylist } from './SpotifyService';
import { logger } from '../utils/logger';

export async function getBeerRecommendation(temperature: number, token: string) {
    logger.info({ temperature }, 'Starting beer recommendation');
    const foundBeer = await BeerService.findBeerStyleByTemperature(temperature);
    if (!foundBeer) {
        logger.warn({ temperature }, 'No beer style found');
        return { beerStyle: null, playlist: { message: 'No beer style found for this temperature.' } };
    }

    let playlist = null;
    if (token) {
        try {
            const playlistResult = await searchPlaylist(foundBeer.name, token);
            if (playlistResult) {
                playlist = {
                    name: playlistResult.name,
                    tracks: playlistResult.tracks
                };
                logger.info({ beer: foundBeer.name, playlist: playlistResult.name }, 'Playlist found');
            } else {
                logger.warn({ beer: foundBeer.name }, 'No playlist found');
            }
        } catch (err) {
            logger.error({ beer: foundBeer.name, err }, 'Error to search playlist');
        }
    }
    return {
        beerStyle: foundBeer.name,
        playlist: playlist ?? { message: 'No playlist found for this beer style.' }
    };
}
