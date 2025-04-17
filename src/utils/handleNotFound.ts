import { Response } from 'express';
import { IBeer } from '../models/Beer.schema';

export function handleNotFound(entity: IBeer | null, res: Response, entityName = 'Beer') {
  if (!entity) {
    res.status(404).json({ error: `${entityName} not found` });
    return true;
  }
  return false;
}