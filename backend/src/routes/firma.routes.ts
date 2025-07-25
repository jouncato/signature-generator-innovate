import { Router } from 'express';
import { FirmaController } from '../controllers/firma.controller';

const router = Router();

// Rutas para firmas
router.post('/', FirmaController.saveFirma);
router.get('/', FirmaController.getFirmas);
router.post('/render-html', FirmaController.renderHtml);
router.post('/generate-image', FirmaController.generateImage);

export default router;

// src/routes/index.ts
import { Router } from 'express';
import firmaRoutes from './firma.routes';

const router = Router();

router.use('/firmas', firmaRoutes);

export default router;