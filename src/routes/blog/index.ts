import express from "express";
import cors from "cors";

import { getVisitData } from "../../controllers/blog/index.controller.js";
import { getGameData } from "../../controllers/blog/game.controller.js";

const router = express.Router();

router.get(
  "/visit",
  cors({
    methods: ["GET"],
  }),
  getVisitData
);
router.get(
  "/game/:id",
  cors({
    origin: "http://localhost:3000",
    methods: ["GET"],
    credentials: true,
  }),
  getGameData
);

export default router;
