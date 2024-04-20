import express from "express";

import {
  getLimits,
  getLimitDates,
  getLimitByDate,
} from "../../controllers/furuyoni/limit.controller.js";

const router = express.Router();

router.get("/", getLimits);
router.get("/:date", getLimitByDate);
router.get("/dates", getLimitDates);

export default router;
