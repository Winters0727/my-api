import express from "express";

import { getHistorys } from "../../controllers/furuyoni/history.controller.js";

const router = express.Router();

router.get("/", getHistorys);

export default router;
