import express from "express";

import { getTwitchAccessToken } from "../../controllers/blog/index.controller.js";

const router = express.Router();

router.get("/twitch/token", getTwitchAccessToken);

export default router;
