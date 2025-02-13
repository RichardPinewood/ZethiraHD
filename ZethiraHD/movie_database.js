document.addEventListener("DOMContentLoaded", async function () {
  const token = localStorage.getItem("token")?.trim();
  if (!token) {
    alert("Precisas de iniciar sessão para visualizar os filmes.");
    return;
  }

  async function fetchMovies() {
    try {
      const response = await fetch("http://localhost:5000/api/auth/movies", {
        headers: { "x-auth-token": token },
      });
      if (!response.ok) throw new Error("Erro ao carregar filmes.");
      
      const movies = await response.json();
      displayMovies(movies);
    } catch (error) {
      console.error("Error fetching movies:", error);
      alert("Não foi possível carregar os filmes.");
    }
  }

  function displayMovies(movies) {
    const movieList = document.getElementById("movieList");
    movieList.innerHTML = "";

    if (movies.length === 0) {
      movieList.innerHTML = "<p>Nenhum filme salvo.</p>";
      return;
    }

    movies.forEach((movie) => {
      const movieCard = document.createElement("div");
      movieCard.classList.add("movie-card");

      const coverSrc = movie.coverPath || "default-cover.jpg";

      movieCard.innerHTML = `
        <img src="${coverSrc}" alt="${movie.title}" class="movie-cover">
        <h3>${movie.title}</h3>
        <p>${movie.year}</p>
        <button class="play-btn" data-id="${movie._id}">▶ Assistir</button>
        <button class="remove-btn" data-id="${movie._id}">×</button>
      `;

      movieList.appendChild(movieCard);

      const playButton = movieCard.querySelector(".play-btn");
      playButton.addEventListener("click", () => {
        window.location.href = `player.html?movieId=${movie._id}`; 
      });
    });

    document.querySelectorAll(".remove-btn").forEach((btn) => {
      btn.addEventListener("click", async function () {
        const movieId = this.getAttribute("data-id");
        if (confirm("Tens a certeza que queres remover o filme ?")) {
          await deleteMovie(movieId);
        }
      });
    });
  }

  async function deleteMovie(movieId) {
    try {
      const response = await fetch(`http://localhost:5000/api/auth/movies/${movieId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
      });
      if (!response.ok) throw new Error("Erro ao eliminar filme.");
      fetchMovies();
    } catch (error) {
      alert("Erro ao eliminiar o filme.");
    }
  }

  fetchMovies();
});
