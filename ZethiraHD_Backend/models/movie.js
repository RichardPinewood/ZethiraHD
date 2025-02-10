const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
  title: String,
  year: String,
  videoPath: String,
  coverPath: String,
  uploadedBy: mongoose.Schema.Types.ObjectId,
});

module.exports = mongoose.model("Movie", movieSchema);
