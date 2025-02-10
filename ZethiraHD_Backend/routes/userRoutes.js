const express = require("express");
const path = require("path");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const Movie = require("../models/movie");
const User = require("../models/user");

const router = express.Router();

const UPLOADS_FOLDER = path.join(__dirname, "../uploads");
if (!fs.existsSync(UPLOADS_FOLDER)) {
  fs.mkdirSync(UPLOADS_FOLDER, { recursive: true });
}

const verifyToken = (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token)
    return res.status(401).json({ message: "Access denied, no token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret");
    req.user = decoded; 
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid token", error });
  }
};

router.get("/profile", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("username email");
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Erro no servidor.", error: error.message });
  }
});

const storage = multer.diskStorage({
  destination: UPLOADS_FOLDER,
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already taken" });
    }

    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

  
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email },
      process.env.JWT_SECRET || "your_jwt_secret",
    );

    res.status(201).json({ message: "User registered successfully", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Email and password are required" });

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || "your_jwt_secret"
    );

    res.json({ message: "Login successful!", token });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});



router.post(
  "/upload",
  verifyToken,
  upload.fields([{ name: "movieFile" }, { name: "coverFile" }]),
  async (req, res) => {
    try {
      const { movieTitle, movieYear } = req.body;
      const movieFile = req.files["movieFile"]
        ? req.files["movieFile"][0]
        : null;
      const coverFile = req.files["coverFile"]
        ? req.files["coverFile"][0]
        : null;

      if (!movieTitle || !movieYear || !movieFile) {
        return res.status(400).json({ message: "Preencha todos os campos obrigatórios." });
      }

      console.log("Movie File Path:", movieFile.path);
      console.log("Cover File Path:", coverFile ? coverFile.path : "No cover uploaded");

      const newMovie = new Movie({
        title: movieTitle,
        year: movieYear,
        videoPath: `uploads/${path.basename(movieFile.path)}`,
        coverPath: coverFile ? `uploads/${path.basename(coverFile.path)}` : null,
        uploadedBy: req.user.id,
      });

      await newMovie.save();
      console.log("New movie saved:", newMovie);
      res.json({ message: "Filme enviado com sucesso!", movie: newMovie });
    } catch (error) {
      console.error("Error uploading movie:", error.message);
      res.status(500).json({ message: "Erro no servidor.", error: error.message });
    }
  }
);

router.get("/movies", verifyToken, async (req, res) => {
  try {
    const movies = await Movie.find({ uploadedBy: req.user.id });
    res.json(
      movies.map((movie) => ({
        _id: movie._id,
        title: movie.title,
        year: movie.year,
        videoPath: movie.videoPath
          ? `http://localhost:5000/${movie.videoPath}`
          : null,
        coverPath: movie.coverPath
          ? `http://localhost:5000/${movie.coverPath}`
          : "default-cover.jpg",
      }))
    );
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar filmes.", error: error.message });
  }
});

router.get("/movies/:id", async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie)
      return res.status(404).json({ message: "Filme não encontrado." });

    res.json({
      _id: movie._id,
      title: movie.title,
      year: movie.year,
      videoPath: movie.videoPath
        ? `http://localhost:5000/${movie.videoPath}`
        : null,
      coverPath: movie.coverPath
        ? `http://localhost:5000/${movie.coverPath}`
        : "default-cover.jpg",
    });
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar filme.", error: error.message });
  }
});

router.delete("/movies/:id", verifyToken, async (req, res) => {
  try {
    const deletedMovie = await Movie.findByIdAndDelete(req.params.id);
    if (!deletedMovie)
      return res.status(404).json({ message: "Filme não encontrado." });

    if (
      deletedMovie.videoPath &&
      fs.existsSync(path.join(__dirname, "../", deletedMovie.videoPath))
    ) {
      fs.unlinkSync(path.join(__dirname, "../", deletedMovie.videoPath));
    }
    if (
      deletedMovie.coverPath &&
      fs.existsSync(path.join(__dirname, "../", deletedMovie.coverPath))
    ) {
      fs.unlinkSync(path.join(__dirname, "../", deletedMovie.coverPath));
    }

    res.json({ message: "Filme removido com sucesso!", deletedMovie });
  } catch (error) {
    res.status(500).json({ message: "Erro ao remover filme.", error: error.message });
  }
});

router.use("/uploads", express.static(path.join(__dirname, "../uploads")));

module.exports = router;
