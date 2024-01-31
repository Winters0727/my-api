import express from 'express';

import FuruyoniRouter from './furuyoni/index.ts';

const router = express.Router();

router.use('/furuyoni', FuruyoniRouter);

export default router;
