import { Beer, IBeer } from '../models/Beer.schema';

export async function createBeer(data: { name: string; minTemp: number; maxTemp: number }): Promise<IBeer> {
  try {
    return await Beer.create(data);
  } catch (error) {
    throw error;
  }
}

export async function getAllBeers(): Promise<IBeer[]> {
  try {
    return await Beer.find();
  } catch (error) {
    throw error;
  }
}

export async function getBeerById(id: string): Promise<IBeer | null> {
  try {
    return await Beer.findById(id);
  } catch (error) {
    throw error;
  }
}

export async function updateBeer(id: string, data: Partial<IBeer>): Promise<IBeer | null> {
  try {
    return await Beer.findByIdAndUpdate(id, data, { new: true });
  } catch (error) {
    throw error;
  }
}

export async function deleteBeer(id: string): Promise<IBeer | null> {
  try {
    return await Beer.findByIdAndDelete(id);
  } catch (error) {
    throw error;
  }
}

export async function findBeerStyleByTemperature(temperature: number): Promise<IBeer | null> {
  try {
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

