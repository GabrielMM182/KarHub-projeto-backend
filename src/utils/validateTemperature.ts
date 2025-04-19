import { Response } from 'express';

export function validateTemperature(temperature: number, res: Response): boolean {
  if (typeof temperature !== 'number' || isNaN(temperature)) {
    res.status(400).json({ error: 'The temperature field must be a valid number.' });
    return true;
  }
  return false;
}
