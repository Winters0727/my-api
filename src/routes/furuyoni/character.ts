import express from 'express';

import {
  getCharacter,
  getCharacterList,
} from '../../controllers/furuyoni/character.controller.ts';

const router = express.Router();

router.get('/list', getCharacterList);
router.get('/:parameter', getCharacter);

export default router;
