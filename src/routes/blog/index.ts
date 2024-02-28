import express from "express";

import { getGameData } from "../../controllers/blog/game.controller.js";

const router = express.Router();

router.get("/game/:id", getGameData);

export default router;
