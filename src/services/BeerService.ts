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
