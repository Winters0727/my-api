import express from "express";

import {
  getRotations,
  getRecentRotation,
} from "../../controllers/furuyoni/rotation.controller.js";

const router = express.Router();

router.get("/", getRotations);
router.get("/recent", getRecentRotation);

export default router;
