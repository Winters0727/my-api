import express from "express";

import {
  getCharacter,
  getCharacterList,
  getCharacterListWithModes,
} from "../../controllers/furuyoni/character.controller.js";

const router = express.Router();

router.get("/", getCharacterList);
router.get("/mode", getCharacterListWithModes);
router.get("/:char", getCharacter);

export default router;
