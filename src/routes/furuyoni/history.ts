import express from "express";

import {
  getCardsHistorys,
  getCardHistorys,
} from "../../controllers/furuyoni/history.controller.js";

const router = express.Router();

router.get("/", getCardsHistorys);
router.get("/:code", getCardHistorys);

export default router;
