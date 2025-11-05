import Event from "../models/Event.js";

// Request to swap
export const requestSwap = async (req, res) => {
  try {
    const requesterEvent = await Event.findOne({
      userId: req.user.id,
      status: "BUSY",
    });

    if (!requesterEvent)
      return res
        .status(404)
        .json({ message: "Requester has no BUSY event to swap" });

    const targetEvent = await Event.findById(req.params.eventId);
    if (!targetEvent)
      return res.status(404).json({ message: "Target event not found" });

    targetEvent.status = "SWAP_PENDING";
    targetEvent.swapRequestedBy = req.user.id;
    await targetEvent.save();

    requesterEvent.status = "SWAP_PENDING";
    requesterEvent.swapWithEvent = targetEvent._id;
    await requesterEvent.save();

    res.json({ message: "Swap request sent successfully" });
  } catch (error) {
    console.error("Request Swap Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Respond to swap (Accept / Reject)
export const swapResponse = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { action } = req.body;
    const userId = req.user.id;

    const event = await Event.findById(eventId);
    console.log("Event found:", event);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.userId.toString() !== userId)
      return res.status(403).json({ message: "Unauthorized" });

    const act = action.toLowerCase();
    if (act === "accept") {
      event.status = "BUSY";
      await event.save();
      return res.json({ message: "Swap accepted" });
    } else if (act === "reject") {
      event.status = "BUSY";
      event.swapRequestedBy = null;
      await event.save();
      return res.json({ message: "Swap rejected" });
    } else {
      return res.status(400).json({ message: "Invalid action" });
    }
  } catch (error) {
    console.error("Swap Response Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
