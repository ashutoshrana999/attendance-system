const mongoose = require("mongoose");

const qrSchema = new mongoose.Schema({
  qrId: String,
  qrName: String,
  type: String,
  createdBy: String,
  expiresAt: Date,   
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Qr", qrSchema);