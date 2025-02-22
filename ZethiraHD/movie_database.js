document.addEventListener("DOMContentLoaded", async function () {
  const token = localStorage.getItem("token")?.trim();
  if (!token) {
    alert("Precisas de iniciar sessão para visualizar os filmes.");
    return;
  }

  async function fetchMovies() {
    try {
      const response = await fetch("https://zethirahd-production-1807.up.railway.app/api/auth/movies", {
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
    
    while (movieList.firstChild) {
      movieList.removeChild(movieList.firstChild);
    }

    if (movies.length === 0) {
      const noMoviesMsg = document.createElement("p");
      noMoviesMsg.textContent = "Nenhum filme salvo.";
      movieList.appendChild(noMoviesMsg);
      return;
    }

    const template = document.getElementById("movieCardTemplate");

    movies.forEach((movie) => {
      const clone = template.content.cloneNode(true);

      const img = clone.querySelector("img.movie-cover");
      img.src = movie.coverPath || "default-cover.jpg";
      img.alt = movie.title;

      const h3 = clone.querySelector("h3");
      h3.textContent = movie.title;

      const p = clone.querySelector("p");
      p.textContent = movie.year;

      const playBtn = clone.querySelector("button.play-btn");
      playBtn.dataset.id = movie._id;
      playBtn.addEventListener("click", () => {
        window.location.href = `player.html?movieId=${movie._id}`;
      });

      const removeBtn = clone.querySelector("button.remove-btn");
      removeBtn.dataset.id = movie._id;
      removeBtn.addEventListener("click", async function () {
        if (confirm("Tens a certeza que queres remover o filme?")) {
          await deleteMovie(movie._id);
        }
      });
      movieList.appendChild(clone);
    });
  }

  async function deleteMovie(movieId) {
    try {
      const response = await fetch(`https://zethirahd-production-1807.up.railway.app/api/auth/movies/${movieId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
      });
      if (!response.ok) throw new Error("Erro ao eliminar filme.");
      fetchMovies();
    } catch (error) {
      alert("Erro ao eliminar o filme.");
    }
  }

  fetchMovies();
});
