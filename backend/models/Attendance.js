const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
    userId: String,
    userName: String,
    qrId: String,
    qrName: String,

    // Date in YYYY-MM-DD format
    date: String,

    // Visit number (1, 2, 3...)
    visitNumber: Number,

    // Entry and Exit times
    inTime: Date,
    outTime: Date,

    // Last updated time
    scannedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Attendance", attendanceSchema);