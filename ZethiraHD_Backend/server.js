const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const authRoutes = require("./routes/userRoutes");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb+srv://ricardopinheiro:Ricardo2003@cluster0.vtypd.mongodb.net/ZethiraHD?retryWrites=true&w=majority";

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.static(path.join(__dirname, "../frontend")));

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../ZethiraHD/home.html"));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
