import express from "express";

import {
  getCardByCode,
  getCardsByCharName,
} from "../../controllers/furuyoni/card.controller.js";

const router = express.Router();

router.get("/character/:char", getCardsByCharName);
router.get("/:code", getCardByCode);

export default router;
