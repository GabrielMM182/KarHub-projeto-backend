import { z } from 'zod';

export const BeerCreateSchema = z.object({
  name: z.string().min(1).trim(),
  minTemp: z.number(),
  maxTemp: z.number(),
}).refine(
  (data) => data.minTemp <= data.maxTemp,
  {
    message: 'Minimum temperature must be less than or equal to the maximum',
    path: ['minTemp', 'maxTemp']
  }
);

export const BeerUpdateSchema = z.object({
  name: z.string().min(1).trim().optional(),
  minTemp: z.number().optional(),
  maxTemp: z.number().optional(),
}).refine(
  (data) => {
    if (data.minTemp !== undefined && data.maxTemp !== undefined) {
      return data.minTemp <= data.maxTemp;
    }
    return true;
  },
  {
    message: 'Minimum temperature must be less than or equal to the maximum',
    path: ['minTemp', 'maxTemp']
  }
);
