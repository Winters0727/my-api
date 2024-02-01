import express from "express";

import {
  getCategories,
  getFaqs,
} from "../../controllers/furuyoni/faq.controller.js";

const router = express.Router();

router.get("/", getFaqs);
router.get("/category", getCategories);

export default router;
