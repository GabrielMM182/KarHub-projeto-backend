import * as BeerService from './BeerService';
import { searchPlaylist } from './SpotifyService';
import { logger } from '../utils/logger';

export async function getBeerRecommendation(temperature: number, token: string) {
    logger.info({ temperature }, 'Iniciando recomendação de cerveja');
    const foundBeer = await BeerService.findBeerStyleByTemperature(temperature);
    if (!foundBeer) {
        logger.warn({ temperature }, 'Nenhum estilo de cerveja encontrado');
        return { beerStyle: null, playlist: { message: 'Nenhum estilo de cerveja encontrado para essa temperatura.' } };
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
                logger.info({ beer: foundBeer.name, playlist: playlistResult.name }, 'Playlist encontrada');
            } else {
                logger.warn({ beer: foundBeer.name }, 'Nenhuma playlist encontrada');
            }
        } catch (err) {
            logger.error({ beer: foundBeer.name, err }, 'Erro ao buscar playlist');
        }
    }
    return {
        beerStyle: foundBeer.name,
        playlist: playlist ?? { message: 'Nenhuma playlist encontrada para este estilo de cerveja.' }
    };
}
