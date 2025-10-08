const mongoose = require("mongoose");
const axios = require("axios");
const Attendance = require("../models/attandanceSchema");
const OriginLocation = require("../models/originLocationSchema");
const Event = require("../models/eventSchema");
const User = require("../models/userScheama");

exports.addAttandance = async (req, res) => {
    try {
        const { eventId, staffId, entry, scannedBy } = req.body;

        if (!eventId || !staffId || !entry) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const staffExists = await User.findById(staffId);
        if (!staffExists) {
            return res.status(404).json({ success: false, message: "Invalid staffId" });
        }

        // ✅ Validate eventId
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ success: false, message: "Invalid eventId" });
        }

        // 1️⃣ Save initial attendance
        let attendance = new Attendance({
            staffId: new mongoose.Types.ObjectId(staffId),
            eventId: new mongoose.Types.ObjectId(eventId),
            entry,
            scannedBy: scannedBy ? new mongoose.Types.ObjectId(scannedBy) : null,
        });

        // 2️⃣ Find latest origin location within 2 hours of entry
        const entryTime = new Date(entry);

        const twoHours = 2 * 60 * 60 * 1000; // 2 hours in ms

        const originLocation = await OriginLocation.findOne({
            staffId: new mongoose.Types.ObjectId(staffId),
            recordedAt: {
                $lte: entryTime, // must be before attendance
                $gte: new Date(entryTime.getTime() - twoHours), // not older than 2 hours
            },
        }).sort({ recordedAt: -1 }); // pick the latest

        // 3️⃣ Fetch event location
        
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        // 4️⃣ Calculate distance using Google Maps Distance Matrix API
        if (originLocation && originLocation.latitude && originLocation.longitude && event.latitude && event.longitude) {
            const googleApiKey = "AIzaSyD0Ui6ctQfTyvSoHXbDA7hKAwMPRugQr4o";
            const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${originLocation.latitude},${originLocation.longitude}&destinations=${event.latitude},${event.longitude}&key=${googleApiKey}`;

            const response = await axios.get(url);

            if (response.data.status === "OK") {
                const distanceMeters =
                    response.data.rows[0].elements[0].distance.value || 0;
                const distanceKm = distanceMeters / 1000;

                attendance.travelledKm = distanceKm.toFixed(2) ;
            }
        }

        await attendance.save();

        console.log(attendance);

        return res.status(201).json({
            success: true,
            message: "Attendance added successfully",
            data: attendance,
        });
    } catch (error) {
        console.error("Error in addAttandance:", error);
        return res.status(500).json({ success: false, error: error.message });
    }
};

exports.checkAttendanceExists = async (req, res) => {

    console.log("checkAttendanceExists params",req.params);
    
    console.log("inside checkAttendanceExists");
    

  try {
    const { staffId, eventId } = req.params;

    if (!staffId || !eventId) {
      return res.status(400).json({ exists: false, message: "Missing parameters" });
    }

    const existing = await Attendance.findOne({
      staffId,
      eventId,
    });

    return res.status(200).json({
      exists: !!existing,
    });
  } catch (error) {
    console.error("Error checking attendance:", error);
    return res.status(500).json({ exists: false, error: error.message });
  }
};

exports.getAttendanceByEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const attendanceList = await Attendance.find({ eventId })
      .populate("staffId", "name email")  // optional: show staff info
      .populate("scannedBy", "name");

    return res.status(200).json({
      success: true,
      data: attendanceList,
    });
  } catch (error) {
    console.error("Error fetching attendance by event:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};


exports.getAttendanceByEventAndStaff = async (req, res) => {
  console.log("inside getAttendanceByEventAndStaff");
  
  try {
    const { eventId, staffId } = req.params;

    const attendance = await Attendance.findOne({ eventId, staffId })
      .populate("staffId", "-qrCode")
     

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: "Attendance not found for this event and staff.",
      });
    }

    console.log(attendance);
    

    return res.status(200).json({
      success: true,
      data: attendance,
    });
  } catch (error) {
    console.error("Error fetching single attendance:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
