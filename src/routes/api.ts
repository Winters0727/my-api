import express from "express";
import cors from "cors";

import BlogRouter from "./blog/index.js";
import FuruyoniRouter from "./furuyoni/index.js";

const router = express.Router();

router.use(
  "/blog",
  cors({
    origin: process.env.BLOG_URL,
    methods: ["GET"],
    credentials: true,
  }),
  BlogRouter
);
router.use(
  "/furuyoni",
  cors({
    methods: ["GET"],
  }),
  FuruyoniRouter
);

export default router;
