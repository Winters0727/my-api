import express from "express";

import FuruyoniRouter from "./furuyoni/index.js";

const router = express.Router();

router.use("/furuyoni", FuruyoniRouter);

export default router;
