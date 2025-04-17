import { Router } from 'express';
import * as BeerController from '../controllers/BeerController';
import { asyncHandler } from '../utils/asyncHandler';
import { validateDto } from '../middlewares/validateDto';
import { BeerCreateSchema, BeerUpdateSchema } from '../dtos/beer.dto';

const router = Router();

router.post('/', validateDto(BeerCreateSchema), asyncHandler(BeerController.create));
router.get('/', asyncHandler(BeerController.getAll));
router.get('/:id', asyncHandler(BeerController.getOne));
router.put('/:id', validateDto(BeerUpdateSchema), asyncHandler(BeerController.update));
router.delete('/:id', asyncHandler(BeerController.remove));
router.post('/recommendation', asyncHandler(BeerController.getRecommendation));

export default router;
