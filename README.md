Imortant : ZethiraHD is still under devolopment,there is plans to install a domain very soon when everything is working fine !

But you can still run the project locally you just need to create the following has i say say bellow :

I hided the file server.js due to vulnerability concerns,it is were i store the password to my databse,in the backend you just need to create the file again,
here it is the code :


const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 5000; ( or any port you like dont forget to change it also in the frontend side)

const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb+srv://username:password@cluster0.vtypd.mongodb.net/Yourdatabsename?retryWrites=true&w=majority";

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

And thats all you have to do ,just in case run "npm install" so it can install all missing depencencies...
