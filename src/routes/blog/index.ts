import express from "express";

import { getVisitData } from "../../controllers/blog/index.controller.js";
import {
  postComment,
  getComments,
  deleteComment,
} from "../../controllers/blog/comment.controller.js";
import {
  getPostData,
  updatePostLikes,
} from "../../controllers/blog/post.controller.js";
import { getGameData } from "../../controllers/blog/game.controller.js";

const router = express.Router();

router.get("/visit", getVisitData);

router.post("/post/:slug/comment", postComment);
router.get("/post/:slug/comment", getComments);
router.get("/post/:slug", getPostData);
router.put("/post/:slug/likes", updatePostLikes);
router.delete("/post/:slug/comment/:id", deleteComment);

router.get("/game/:id", getGameData);

export default router;
