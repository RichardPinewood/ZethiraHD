document.addEventListener("DOMContentLoaded", async function () { 
  const uploadForm = document.getElementById("upload-form");
  const fileSelectButton = document.getElementById("file-select-button");
  const fileInput = document.getElementById("file-input");
  const fileInfo = document.getElementById("file-info");
  const separator = document.getElementById("separator");
  const inputGroup = document.getElementById("input-group");
  const movieTitle = document.getElementById("movie-title");
  const movieYear = document.getElementById("movie-year");
  const saveButton = document.getElementById("save-movie-button");

  const coverContainer = document.getElementById("cover-container");
  const coverInput = document.getElementById("cover-input");
  const coverPreview = document.getElementById("cover-preview");

  let token = localStorage.getItem("token")?.trim();
  if (!token) {
    alert("Você precisa estar logado para fazer upload de filmes.");
    return;
  }
  console.log("JWT Token Retrieved:", token);

  fileSelectButton.addEventListener("click", function () {
    fileInput.click();
  });

  fileInput.addEventListener("change", function () {
    if (fileInput.files.length > 0) {
      const fileName = fileInput.files[0].name;
      fileInfo.textContent = `Ficheiro selecionado: ${fileName}`;
      fileInfo.classList.add("active");
      separator.classList.add("active");
      inputGroup.classList.add("active");
      coverContainer.classList.add("active");
      saveButton.style.display = "block";
      // Hide the "Anexar Conteúdo" button
      fileSelectButton.style.display = "none";
    } else {
      fileInfo.textContent = "Nenhum ficheiro selecionado";
      fileInfo.classList.remove("active");
      separator.classList.remove("active");
      inputGroup.classList.remove("active");
      coverContainer.classList.remove("active");
      saveButton.style.display = "none";
      fileSelectButton.style.display = "block";
    }
  });

  coverPreview.addEventListener("click", function () {
    coverInput.click();
  });

  coverInput.addEventListener("change", function () {
    if (coverInput.files && coverInput.files[0]) {
      const reader = new FileReader();
      reader.onload = function (e) {
        coverPreview.style.backgroundImage = `url(${e.target.result})`;
        coverPreview.textContent = "";
      };
      reader.readAsDataURL(coverInput.files[0]);
    }
  });

  uploadForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    if (!token) {
      alert("Você precisa estar logado para fazer upload de filmes.");
      return;
    }

    const title = movieTitle.value.trim();
    const year = movieYear.value.trim();
    const file = fileInput.files[0];

    if (!title || !year || !file) {
      alert("Por favor, insira o nome, o ano e selecione um ficheiro.");
      return;
    }

    const formData = new FormData();
    formData.append("movieTitle", title);
    formData.append("movieYear", year);
    formData.append("movieFile", file);

    if (coverInput.files && coverInput.files[0]) {
      formData.append("coverFile", coverInput.files[0]);
    }

    for (let [key, value] of formData.entries()) {
      console.log(`FormData entry - ${key}:`, value);
    }

    try {
      saveButton.textContent = "Enviando...";
      saveButton.disabled = true;

      const response = await fetch("http://localhost:5000/api/auth/upload", {
        method: "POST",
        body: formData,
        headers: {
          "x-auth-token": token 
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao fazer upload do filme");
      }

      const data = await response.json();
      console.log("Upload feito com sucesso:", data);
      alert(`Filme "${data.movie.title}" (${data.movie.year}) salvo com sucesso!`);

      // Reset the form and UI elements
      uploadForm.reset();
      fileInfo.textContent = "Nenhum ficheiro selecionado";
      fileInfo.classList.remove("active");
      separator.classList.remove("active");
      inputGroup.classList.remove("active");
      coverContainer.classList.remove("active");
      saveButton.style.display = "none";
      saveButton.textContent = "Salvar";
      saveButton.disabled = false;
      // Show the "Anexar Conteúdo" button after reset
      fileSelectButton.style.display = "block";

      if (data.movie.coverPath) {
        coverPreview.style.backgroundImage = `url(http://localhost:5000/${data.movie.coverPath})`;
      } else {
        coverPreview.style.backgroundImage = "";
      }
      coverPreview.textContent = "";

      window.location.href = "library.html";
    } catch (error) {
      console.error("Upload Error:", error);
      if (error.message.includes("Invalid token")) {
        alert("O token é inválido. Por favor, faça login novamente.");
      } else {
        alert("Ocorreu um erro durante o upload: " + error.message);
      }
      saveButton.textContent = "Salvar";
      saveButton.disabled = false;
    }
  });
});
