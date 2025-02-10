const urlParams = new URLSearchParams(window.location.search);
    const movieId = urlParams.get("movieId"); 

    if (!movieId) {
      alert("Nenhum vídeo encontrado.");
      window.location.href = "library.html";
    } else {
      fetch(`http://localhost:5000/api/auth/movies/${movieId}`) 
        .then(response => response.json())
        .then(movie => {
          if (movie.videoPath) {
            document.getElementById("videoSource").src = movie.videoPath;
            document.querySelector("video").load(); 
            console.log("Video loaded:", movie.videoPath);
          } else {
            alert("Erro ao carregar o vídeo.");
            window.location.href = "library.html";
          }
        })
        .catch(error => {
          console.error("Error fetching movie:", error);
          alert("Erro ao buscar o vídeo.");
          window.location.href = "library.html";
        });
    }