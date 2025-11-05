import Event from "../models/Event.js";
import mongoose from "mongoose";

// new event
export const createEvent = async (req, res) => {
  try {
    const { title, startTime, endTime } = req.body;
    if (!title || !startTime || !endTime) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const event = new Event({
      title,
      startTime,
      endTime,
      userId: req.user.id,
    });

    await event.save();
    res.status(201).json({ message: "Event created", event });
  } catch (error) {
    console.error("Create Event Error", error);
    res.status(500).json({ message: "Server error" });
  }
};

// all event for logged-in user
export const getMyEvents = async (req, res) => {
  try {
    const events = await Event.find({ userId: req.user.id }).sort({
      startTime: 1,
    });
    res.json(events);
  } catch (error) {
    console.error(" Get Events Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// update event
export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const event = await Event.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      updates,
      { new: true }
    );
    if (!event) return res.status(404).json({ message: "Event not found" });

    res.json({ message: "Event Updated", event });
  } catch (error) {
    console.error("Update Event Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// delete event
export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findOneAndDelete({
      _id: id,
      userId: req.user.id,
    });
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json({ message: "Event deleted" });
  } catch (error) {
    console.error("Delete Event Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// swappable events
export const getSwappableSlots = async (req, res) => {
  try {
    const events = await Event.find({
      status: "SWAPPABLE",
      userId: { $ne: new mongoose.Types.ObjectId(req.user.id) },
    })
      .populate("userId", "name email")
      .sort({ startTime: 1 });
    res.json(events);
  } catch (error) {
    console.error("Get Swappable Slots Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// request to swap
export const requestSwap = async (req, res) => {
  try {
    const { eventId } = req.params;

    const targetEvent = await Event.findById(eventId);
    if (!targetEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (targetEvent.userId.toString() === req.user.id) {
      return res
        .status(400)
        .json({ message: "You cannot swap your own event" });
    }

    if (targetEvent.status !== "SWAPPABLE") {
      return res.status(400).json({ message: "Event not swappable" });
    }

    targetEvent.status = "SWAP_PENDING";
    targetEvent.swapRequestedBy = req.user.id;

    await targetEvent.save();
    res.json({
      message: "Swap request sent successfully",
      event: targetEvent,
    });
  } catch (error) {
    console.error("Swap Request Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Respond to swap (accept/reject)
export const respondToSwap = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { action } = req.body;

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.userId.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You can only respond to your own event requests" });
    }

    if (event.status !== "SWAP_PENDING") {
      return res
        .status(400)
        .json({ message: "No pending swap request for this event" });
    }

    if (action === "reject") {
      event.status = "SWAPPABLE";
      event.swapRequestedBy = null;
      await event.save();
      return res.json({ message: "Swap request rejected", event });
    }

    if (action === "accept") {
      const requesterId = event.swapRequestedBy;
      const requesterEvent = await Event.findOne({
        userId: requesterId,
        status: "BUSY",
      });

      if (!requesterEvent) {
        event.userId = event.swapRequestedBy;
        event.status = "BUSY";
        event.swapRequestedBy = null;
        await event.save();

        return res.json({
          message: "Swap accepted (transferred to requester directly)",
          event,
        });
      }

      const ownerId = event.userId;
      event.userId = requesterId;
      requesterEvent.userId = ownerId;

      event.status = "BUSY";
      requesterEvent.status = "BUSY";

      event.swapRequestedBy = null;

      await event.save();
      await requesterEvent.save();

      return res.json({
        message: "Swap accepted successfully",
        event,
        swappedWith: requesterEvent,
      });
    }

    return res.status(400).json({ message: "Invalid action" });
  } catch (error) {
    console.error("Swap Response Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
