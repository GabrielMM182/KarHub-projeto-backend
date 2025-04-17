import * as BeerService from './BeerService';
import { searchPlaylist } from './SpotifyService';

export async function getBeerRecommendation(temperature: number, token: string) {
    const foundBeer = await BeerService.findBeerStyleByTemperature(temperature);
    if (!foundBeer) {
        return { beerStyle: null, playlist: { message: 'Nenhum estilo de cerveja encontrado para essa temperatura.' } };
    }

    let playlist = null;
    if (token) {
        const playlistResult = await searchPlaylist(foundBeer.name, token);
        if (playlistResult) {
            playlist = {
                name: playlistResult.name,
                tracks: playlistResult.tracks
            };
        }
    }
    return {
        beerStyle: foundBeer.name,
        playlist: playlist ?? { message: 'Nenhuma playlist encontrada para este estilo de cerveja.' }
    };
}
