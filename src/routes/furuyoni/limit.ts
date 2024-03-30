import express from "express";

import {
  getLimits,
  getLimitDates,
} from "../../controllers/furuyoni/limit.controller.js";

const router = express.Router();

router.get("/", getLimits);
router.get("/dates", getLimitDates);

export default router;
