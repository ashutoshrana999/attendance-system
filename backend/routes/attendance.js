const express = require("express");
const router = express.Router();
const Attendance = require("../models/Attendance");
const Qr = require("../models/Qr");

router.post("/scan", async (req, res) => {
    try {
        const { userId, userName, qrId } = req.body;

        // Find QR
        const qr = await Qr.findOne({ qrId });

        if (!qr) {
            return res.json({ message: "Invalid QR" });
        }

        // Check dynamic QR expiry
        if (qr.type === "dynamic" && qr.expiresAt < new Date()) {
            return res.json({ message: "QR Expired" });
        }

        // Today's date in YYYY-MM-DD format
        const today = new Date().toISOString().split("T")[0];

        // Find latest visit for this user and QR on today's date
        const lastVisit = await Attendance.findOne({
            userId,
            qrName: qr.qrName,
            date: today
        }).sort({ visitNumber: -1 });

        // CASE 1: No visit exists OR previous visit already has outTime
        if (!lastVisit || lastVisit.outTime) {
            const visitNumber = lastVisit
                ? lastVisit.visitNumber + 1
                : 1;

            const newAttendance = new Attendance({
                userId,
                userName,
                qrId,
                qrName: qr.qrName,
                date: today,
                visitNumber,
                inTime: new Date(),
                outTime: null
            });

            await newAttendance.save();

            return res.json({
                message: `Visit ${visitNumber} Started`,
                type: "IN"
            });
        }

        // CASE 2: Previous visit exists without outTime → mark OUT
        lastVisit.outTime = new Date();
        lastVisit.scannedAt = new Date();

        await lastVisit.save();

        res.json({
            message: `Visit ${lastVisit.visitNumber} Ended`,
            type: "OUT"
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Error marking attendance"
        });
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