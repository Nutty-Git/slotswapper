import express from "express";
import {
  createEvent,
  getMyEvents,
  getSwappableSlots,
  updateEvent,
  deleteEvent,
  requestSwap,
  respondToSwap,
} from "../controllers/eventController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createEvent);
router.get("/", protect, getMyEvents);
router.get("/swappable-slots", protect, getSwappableSlots);
router.post("/swap-request/:eventId", protect, requestSwap);
router.post("/swap-response/:eventId", protect, respondToSwap);
router.put("/:id", protect, updateEvent);
router.delete("/:id", protect, deleteEvent);

export default router;
