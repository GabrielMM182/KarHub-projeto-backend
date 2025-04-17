import { Request, Response } from 'express';
import * as BeerService from '../services/BeerService';

export async function create(req: Request, res: Response): Promise<void> {
  const beer = await BeerService.createBeer(req.body);
  res.status(201).json(beer);
}

export async function getAll(req: Request, res: Response): Promise<void> {
  const beers = await BeerService.getAllBeers();
  res.status(200).json(beers);
}

export async function getOne(req: Request, res: Response): Promise<void> {
  const beer = await BeerService.getBeerById(req.params.id);
  if (!beer) {
    res.status(404).json({ error: 'Beer not found' });
    return;
  }
  res.status(200).json(beer);
}

export async function update(req: Request, res: Response): Promise<void> {
  const beer = await BeerService.updateBeer(req.params.id, req.body);
  if (!beer) {
    res.status(404).json({ error: 'Beer not found' });
    return;
  }
  res.status(200).json(beer);
}

export async function remove(req: Request, res: Response): Promise<void> {
  const beer = await BeerService.deleteBeer(req.params.id);
  if (!beer) {
    res.status(404).json({ error: 'Beer not found' });
    return;
  }
  res.status(204).send();
}
