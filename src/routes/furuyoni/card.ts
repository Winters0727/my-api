import express from "express";

import {
  getCardByCode,
  getCardsByCharName,
  getCardsByKeyword,
} from "../../controllers/furuyoni/card.controller.js";

const router = express.Router();

router.get("/character/:char", getCardsByCharName);
router.get("/search", getCardsByKeyword);
router.get("/:code", getCardByCode);

export default router;
