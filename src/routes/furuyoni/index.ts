import express from "express";

import CharacterRouter from "./character.js";
import CardRouter from "./card.js";
import FaqRouter from "./faq.js";
import HistoryRouter from "./history.js";
import LimitRouter from "./limit.js";
import RotationRouter from "./rotation.js";

const router = express.Router();

router.use("/character", CharacterRouter);
router.use("/card", CardRouter);
router.use("/faq", FaqRouter);
router.use("/history", HistoryRouter);
router.use("/limit", LimitRouter);
router.use("/rotation", RotationRouter);

export default router;
