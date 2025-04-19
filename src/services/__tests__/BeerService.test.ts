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

  it('deve retornar a cerveja correta com base na temperatura', async () => {
    mockAggregate.mockResolvedValueOnce([
      { name: 'Pilsen', minTemp: 4, maxTemp: 6 }
    ]);
    const result = await findBeerStyleByTemperature(5);
    expect(result).toEqual({ name: 'Pilsen', minTemp: 4, maxTemp: 6 });
  });

  it('deve retornar null se nenhuma cerveja for encontrada', async () => {
    mockAggregate.mockResolvedValueOnce([]);
    const result = await findBeerStyleByTemperature(99);
    expect(result).toBeNull();
  });

  it('deve propagar erro se aggregate lançar erro', async () => {
    mockAggregate.mockRejectedValueOnce(new Error('erro'));
    await expect(findBeerStyleByTemperature(1)).rejects.toThrow('erro');
  });
});
