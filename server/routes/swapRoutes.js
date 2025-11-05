import express from "express";
import { requestSwap, swapResponse } from "../controllers/swapController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/request/:eventId", protect, requestSwap);

router.post("/swap-response/:eventId", protect, swapResponse);

export default router;
