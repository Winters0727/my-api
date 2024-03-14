import express from "express";

import { getVisitData } from "../../controllers/blog/index.controller.js";
import {
  getPostData,
  updatePostLikes,
} from "../../controllers/blog/post.controller.js";
import { getGameData } from "../../controllers/blog/game.controller.js";

const router = express.Router();

router.get("/visit", getVisitData);
router.get("/post/:slug", getPostData);
router.put("/post/:slug/likes", updatePostLikes);
router.get("/game/:id", getGameData);

export default router;
