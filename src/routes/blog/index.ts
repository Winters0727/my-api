import express from "express";

import { getVisitData } from "../../controllers/blog/index.controller.js";
import { getGameData } from "../../controllers/blog/game.controller.js";

const router = express.Router();

router.get("/visit", getVisitData);
router.get("/game/:id", getGameData);

export default router;
