const Event = require("../models/eventSchema");

// ✅ Add Event
exports.addEvent = async (req, res) => {
  try {
    console.log("📥 Event request body:", req.body);

    const {
      title,
      venue,
      date,
      customer,
      phone,
      location,
      latitude,
      longitude,
      status,
      visibleForStaff,
      time,
      addedby,
    } = req.body;

    // Required fields validation
    if (
      !title ||
      !venue ||
      !date ||
      !customer ||
      !phone ||
      !status ||
      !visibleForStaff ||
      !time ||
      !addedby
    ) {
      return res.status(400).json({ message: "❌ Missing required fields" });
    }

    // 🔍 Duplicate check: same venue, date, and time
    const existingEvent = await Event.findOne({ venue, date, time });
    if (existingEvent) {
      return res
        .status(409)
        .json({ message: "❌ Event already exists at this venue, date, and time" });
    }

    // Create new event
    const newEvent = new Event({
      title,
      venue,
      date,
      time,
      customer,
      phone,
      status,
      addedby,
      visibleForStaff,
      ...(location && { location }),
      ...(latitude && { latitude }),
      ...(longitude && { longitude }),
    });

    await newEvent.save();

    res.status(201).json({
      message: "✅ Event created successfully",
      event: newEvent,
    });
  } catch (error) {
    console.error("❌ Error creating event:", error.message);
    res
      .status(500)
      .json({ message: "Error creating event", error: error.message });
  }
};



// ✅ Get all admin events
exports.getEvents = async (req, res) => {
  try {
    const { status = "upcoming", page = 1, limit = 10 } = req.query;
    let filter = {};
    let sort = {};

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 🔎 Apply filter + sorting rules
    if (status === "past") {
      filter.date = { $lt: today };
      sort = { date: -1 }; // latest expired first
    } else if (status === "upcoming") {
      filter.date = { $gte: today };
      sort = { date: 1 }; // today first, then tomorrow, then future
    } else {
      // status = all
      sort = { date: 1 }; // keep ascending for consistency
    }

    const skip = (page - 1) * limit;

    const events = await Event.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

    const total = await Event.countDocuments(filter);

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
      events,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching events",
      error: error.message,
    });
  }
};

exports.allevents = async (req,res)=>{
    try {
        const all = await Event.find().sort({createdAt:-1})
        res.status(200).json(all)
    } catch (e) {
        res.status(401).json(e)
    }
}


// 🟢 Show only today's and tomorrow's events to users
exports.getUserEvents = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const dayAfterTomorrow = new Date(today);
    dayAfterTomorrow.setDate(today.getDate() + 2);

    const events = await Event.find({
      startDate: { $gte: today, $lt: dayAfterTomorrow }, // only today & tomorrow
    }).sort({ startDate: 1 });

    res.status(200).json(events);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching user events", error: error.message });
  }
};



// Update Event
exports.updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedEvent = await Event.findByIdAndUpdate(id, updates, { new: true });

    if (!updatedEvent) {
      return res.status(404).json({ message: "❌ Event not found" });
    }

    res.status(200).json({
      message: "✅ Event updated successfully",
      event: updatedEvent,
    });
  } catch (error) {
    console.error("❌ Error updating event:", error.message);
    res.status(500).json({ message: "Error updating event", error: error.message });
  }
};

// Delete Event
exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedEvent = await Event.findByIdAndDelete(id);

    if (!deletedEvent) {
      return res.status(404).json({ message: "❌ Event not found" });
    }

    res.status(200).json({ message: "✅ Event deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting event:", error.message);
    res.status(500).json({ message: "Error deleting event", error: error.message });
  }
};
