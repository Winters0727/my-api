import express from "express";

import CharacterRouter from "./character.js";
import CardRouter from "./card.js";
import FaqRouter from "./faq.js";

const router = express.Router();

router.use("/character", CharacterRouter);
router.use("/card", CardRouter);
router.use("/faq", FaqRouter);

export default router;
