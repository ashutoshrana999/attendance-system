const express = require("express");
const router = express.Router();
const QRCode = require("qrcode");
const { v4: uuidv4 } = require("uuid");
const Qr = require("../models/Qr");


router.post("/generate-qr", async (req, res) => {
    try {
        const { qrName, type, adminId } = req.body;

        const qrId = uuidv4();

        let expiresAt = null;

        
        if (type === "dynamic") {
            // delete previous dynamic QR of this admin
            await Qr.deleteMany({ createdBy: adminId, type: "dynamic" });

            // set expiry
            expiresAt = new Date(Date.now() + 30000);
        }

        // save new QR
        const newQR = new Qr({
            qrId,
            qrName,
            type,
            createdBy: adminId,
            expiresAt
        });

        await newQR.save();

        const qrImage = await QRCode.toDataURL(qrId);

        res.json({
            message: "QR Generated",
            qrId,
            qrImage
        });

    } catch (err) {
        res.status(500).json({ message: "Error generating QR" });
    }
});


// GET all QR of admin
// router.get("/admin-qr/:adminId", async (req, res) => {
//     try {
//         const { adminId } = req.params;

//         const qrs = await Qr.find({ createdBy: adminId }).sort({ createdAt: -1 });

//         res.json(qrs);

//     } catch (err) {
//         res.status(500).json({ message: "Error fetching QR" });
//     }
// });


// GET all QRs of admin
router.get("/admin-qr/:adminId", async (req, res) => {
    try {
        const qrs = await Qr.find({ createdBy: req.params.adminId })
            .sort({ createdAt: -1 });

        // convert each qrId → qrImage
        const result = [];

        for (let qr of qrs) {
            const qrImage = await QRCode.toDataURL(qr.qrId);

            result.push({
                qrId: qr.qrId,
                qrName: qr.qrName,
                type: qr.type,          // ✅ VERY IMPORTANT
                expiresAt: qr.expiresAt, // optional but useful
                qrImage
            });
        }

        res.json(result);

    } catch (err) {
        res.status(500).json({ message: "Error fetching QR" });
    }
});

const Attendance = require("../models/Attendance");


router.delete("/delete-qr/:qrId", async (req, res) => {
    try {
        const { qrId } = req.params;

        
        await Qr.deleteOne({ qrId });

        
        await Attendance.deleteMany({ qrId });

        res.json({ message: "QR and related attendance deleted" });

    } catch (err) {
        res.status(500).json({ message: "Error deleting QR" });
    }
});


module.exports = router;