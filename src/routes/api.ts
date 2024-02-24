import express from "express";

import BlogRouter from "./blog/index.js";
import FuruyoniRouter from "./furuyoni/index.js";

const router = express.Router();

router.use("/blog", BlogRouter);
router.use("/furuyoni", FuruyoniRouter);

export default router;
