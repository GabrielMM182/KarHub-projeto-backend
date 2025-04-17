import { Beer, IBeer } from '../models/Beer.schema';
import { logger } from '../utils/logger';

export async function createBeer(data: { name: string; minTemp: number; maxTemp: number }): Promise<IBeer> {
  try {
    logger.info({ data }, 'Criando nova cerveja');
    const beer = await Beer.create(data);
    logger.info({ beer }, 'Cerveja criada com sucesso');
    return beer;
  } catch (error) {
    logger.error({ data, error }, 'Erro ao criar cerveja');
    throw error;
  }
}

export async function getAllBeers(): Promise<IBeer[]> {
  try {
    return await Beer.find();
  } catch (error) {
    logger.error({ error }, 'Erro ao buscar todas as cervejas');
    throw error;
  }
}

export async function getBeerById(id: string): Promise<IBeer | null> {
  try {
    return await Beer.findById(id);
  } catch (error) {
    logger.error({ id, error }, 'Erro ao buscar cerveja por ID');
    throw error;
  }
}

export async function updateBeer(id: string, data: Partial<IBeer>): Promise<IBeer | null> {
  try {
    return await Beer.findByIdAndUpdate(id, data, { new: true });
  } catch (error) {
    logger.error({ id, data, error }, 'Erro ao atualizar cerveja');
    throw error;
  }
}

export async function deleteBeer(id: string): Promise<IBeer | null> {
  try {
    return await Beer.findByIdAndDelete(id);
  } catch (error) {
    logger.error({ id, error }, 'Erro ao deletar cerveja');
    throw error;
  }
}

export async function findBeerStyleByTemperature(temperature: number): Promise<IBeer | null> {
  try {
    logger.info({ temperature }, 'Buscando estilo de cerveja pela temperatura');
    const result = await Beer.aggregate([
      {
        $addFields: {
          avgTemp: { $divide: [{ $add: ["$minTemp", "$maxTemp"] }, 2] }
        }
      },
      {
        $addFields: {
          tempDifference: { $abs: { $subtract: ["$avgTemp", temperature] } }
        }
      },
      {
        $sort: { tempDifference: 1, name: 1 }
      },
      { $limit: 1 },
      {
        $project: {
          _id: 1,
          name: 1,
          minTemp: 1,
          maxTemp: 1
        }
      }
    ]);
    return result.length > 0 ? result[0] as IBeer : null;
  } catch (error) {
    throw error;
  }
}

