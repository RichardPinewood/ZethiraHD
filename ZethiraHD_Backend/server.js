const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const authRoutes = require("./routes/userRoutes");
require("dotenv").config(); // Load .env variables

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI; // Get MongoDB URI from environment variables

console.log("🔍 Mongo URI from .env:", MONGO_URI); // Debugging line

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Static files (Frontend & Uploads)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.static(path.join(__dirname, "../frontend")));

// Routes
app.use("/api/auth", authRoutes);

// Serve Frontend
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../ZethiraHD/home.html"));
});

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
