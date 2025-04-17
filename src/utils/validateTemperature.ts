import { Response } from 'express';

export function validateTemperature(temperature: number, res: Response): boolean {
  if (typeof temperature !== 'number' || isNaN(temperature)) {
    res.status(400).json({ error: 'O campo temperature deve ser um número válido.' });
    return true;
  }
  return false;
}
