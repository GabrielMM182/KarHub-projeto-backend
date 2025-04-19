import * as BeerService from '../BeerService';
import { getBeerRecommendation } from '../RecommendationService';
import { searchPlaylist } from '../SpotifyService';

jest.mock('../BeerService');
jest.mock('../SpotifyService');

const mockedFindBeerStyleByTemperature = BeerService.findBeerStyleByTemperature as jest.Mock;
const mockedSearchPlaylist = searchPlaylist as jest.Mock;

describe('RecommendationService', () => {
  afterEach(() => jest.clearAllMocks());

  it('should return beer recommendation and playlist', async () => {
    mockedFindBeerStyleByTemperature.mockResolvedValueOnce({ name: 'IPA' });
    mockedSearchPlaylist.mockResolvedValueOnce({ name: 'IPA Playlist', tracks: ['track1', 'track2'] });

    const result = await getBeerRecommendation(20, 'fake-token');
    expect(result).toEqual({
      beerStyle: 'IPA',
      playlist: { name: 'IPA Playlist', tracks: ['track1', 'track2'] }
    });
  });

  it('should return message if no beer style found', async () => {
    mockedFindBeerStyleByTemperature.mockResolvedValueOnce(null);
    const result = await getBeerRecommendation(99, 'fake-token');
    expect(result).toEqual({
      beerStyle: null,
      playlist: { message: 'No beer style found for this temperature.' }
    });
  });

  it('should return message if no playlist found', async () => {
    mockedFindBeerStyleByTemperature.mockResolvedValueOnce({ name: 'Lager' });
    mockedSearchPlaylist.mockResolvedValueOnce(null);
    const result = await getBeerRecommendation(15, 'fake-token');
    expect(result).toEqual({
      beerStyle: 'Lager',
      playlist: { message: 'No playlist found for this beer style.' }
    });
  });
});
