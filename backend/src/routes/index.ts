import { Router } from 'express';
import firmaRoutes from './firma.routes';

const router = Router();

router.use('/firmas', firmaRoutes);

export default router;