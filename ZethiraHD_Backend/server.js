require("dotenv").config({ path: "./.env" });

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const authRoutes = require("./routes/userRoutes");

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

console.log("Mongo URI from .env:", MONGO_URI); 

if (!MONGO_URI) {
    console.error(" MONGO_URI is not defined. Check your .env file.");
    process.exit(1);
}

app.use(cors());
app.use(express.json());

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.static(path.join(__dirname, "../frontend/build")));

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../ZethiraHD/home.html"));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
