import { findBeerStyleByTemperature } from '../BeerService';
import { Beer } from '../../models/Beer.schema';

jest.mock('../../models/Beer.schema');

describe('BeerService - findBeerStyleByTemperature', () => {
  const mockAggregate = jest.fn();
  beforeAll(() => {
    (Beer.aggregate as jest.Mock) = mockAggregate;
  });

  afterEach(() => {
    mockAggregate.mockReset();
  });

  it('should return the correct beer with base on temperature', async () => {
    mockAggregate.mockResolvedValueOnce([
      { name: 'Pilsen', minTemp: 4, maxTemp: 6 }
    ]);
    const result = await findBeerStyleByTemperature(5);
    expect(result).toEqual({ name: 'Pilsen', minTemp: 4, maxTemp: 6 });
  });

  it('should return null if no beer is found', async () => {
    mockAggregate.mockResolvedValueOnce([]);
    const result = await findBeerStyleByTemperature(99);
    expect(result).toBeNull();
  });

  it('should propagate error if aggregate throws error', async () => {
    mockAggregate.mockRejectedValueOnce(new Error('error'));
    await expect(findBeerStyleByTemperature(1)).rejects.toThrow('error');
  });
});
