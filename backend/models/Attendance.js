const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  userId: String,
  userName: String,
  qrId: String,
  qrName: String,
  scannedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Attendance", attendanceSchema);