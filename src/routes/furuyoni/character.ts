import express from "express";

import {
  getCharacter,
  getCharacterList,
} from "../../controllers/furuyoni/character.controller.js";

const router = express.Router();

router.get("/", getCharacterList);
router.get("/:parameter", getCharacter);

export default router;
