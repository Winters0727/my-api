import express from 'express';

import {
  getCardByCode,
  getCardsByCharName,
} from '../../controllers/furuyoni/card.controller.ts';

const router = express.Router();

router.get('/:code', getCardByCode);
router.get('/character/:charName', getCardsByCharName);

export default router;
