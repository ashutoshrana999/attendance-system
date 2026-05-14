// Load environment variables from .env
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve frontend files from the "public" folder
app.use(express.static(path.join(__dirname, "public")));

// MongoDB Atlas connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("MongoDB Error:", err));

// Routes
const authRoutes = require("./routes/auth");
app.use("/api", authRoutes);

const qrRoutes = require("./routes/qr");
app.use("/api", qrRoutes);

const attendanceRoutes = require("./routes/attendance");
app.use("/api", attendanceRoutes);

// Default route - opens index.html when visiting the root URL
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Optional health check route
app.get("/health", (req, res) => {
  res.send("Server is running successfully");
});

// Use Render's assigned port in production, fallback to 5000 locally
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});