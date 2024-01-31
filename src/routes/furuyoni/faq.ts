import express from 'express';

import {
  getCategories,
  getFaqs,
} from '../../controllers/furuyoni/faq.controller.ts';

const router = express.Router();

router.get('/', getFaqs);
router.get('/category', getCategories);

export default router;
