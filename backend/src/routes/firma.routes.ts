import { Router } from 'express';
import { FirmaController } from '../controllers/firma.controller';

const router = Router();

router.post('/', FirmaController.saveFirma);
router.get('/', FirmaController.getFirmas);
router.post('/render-html', FirmaController.renderHtml);
router.post('/generate-image', FirmaController.generateImage);

export default router;