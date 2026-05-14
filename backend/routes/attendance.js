const express = require("express");
const router = express.Router();
const Attendance = require("../models/Attendance");
const Qr = require("../models/Qr");

// scan qr api
router.post("/scan", async (req, res) => {
  try {
    const { userId, userName, qrId } = req.body;

    
    // find QR
      const qr = await Qr.findOne({ qrId });

      if (!qr) {
        return res.json({ message: "Invalid QR" });
      }

      // CHECK DYNAMIC QR EXPIRY
      if (qr.type === "dynamic" && qr.expiresAt < new Date()) {
        return res.json({ message: "QR Expired" });
      }

    
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const exists = await Attendance.findOne({
      userId,
      qrId,
      scannedAt: {
        $gte: todayStart,
        $lte: todayEnd
      }
    });

    if (exists) {
      return res.json({ message: "Already marked for today" });
    }

    // save attendance
    const newAttendance = new Attendance({
      userId,
      userName,
      qrId,
      qrName: qr.qrName
    });

    await newAttendance.save();

    res.json({ message: "Attendance Marked" });

  } catch (err) {
    res.status(500).json({ message: "Error marking attendance" });
  }
});

router.get("/user-attendance/:userId", async (req, res) => {
    const data = await Attendance.find({ userId: req.params.userId })
        .sort({ scannedAt: -1 });

    res.json(data);
});

// GET all attendance for admin
// router.get("/admin-attendance/:adminId", async (req, res) => {
//     try {

//         const { adminId } = req.params;

//         // find QRs created by admin
//         const qrs = await Qr.find({ createdBy: adminId });

//         const qrIds = qrs.map(qr => qr.qrId);

//         // find attendance linked to those QRs
//         const attendance = await Attendance.find({
//             qrId: { $in: qrIds }
//         }).sort({ scannedAt: -1 });

//         res.json(attendance);

//     } catch (err) {
//         res.status(500).json({ message: "Error fetching attendance" });
//     }
// });

router.get("/admin-attendance/:adminId", async (req, res) => {
    try {
        const { adminId } = req.params;

        // Find all QR codes created by this admin
        const qrs = await Qr.find({ createdBy: adminId });

        // Extract QR names
        const qrNames = qrs.map(qr => qr.qrName);

        // Find attendance records matching these QR names
        const attendance = await Attendance.find({
            qrName: { $in: qrNames }
        }).sort({ scannedAt: -1 });

        res.json(attendance);

    } catch (err) {
        console.error("Admin Attendance Error:", err);
        res.status(500).json({
            message: "Error fetching attendance"
        });
    }
});


module.exports = router;