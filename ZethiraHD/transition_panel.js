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

  // Retrieve JWT Token from localStorage
  let token = localStorage.getItem("token")?.trim();
  if (!token) {
    alert("Você precisa estar logado para fazer upload de filmes.");
    return;
  }
  console.log("JWT Token Retrieved:", token);

  // Trigger file selection for movie file
  fileSelectButton.addEventListener("click", function () {
    fileInput.click();
  });

  // Update UI when a movie file is selected
  fileInput.addEventListener("change", function () {
    if (fileInput.files.length > 0) {
      const fileName = fileInput.files[0].name;
      fileInfo.textContent = `Ficheiro selecionado: ${fileName}`;
      fileInfo.classList.add("active");
      separator.classList.add("active");
      inputGroup.classList.add("active");
      coverContainer.classList.add("active");
      saveButton.style.display = "block";
    } else {
      fileInfo.textContent = "Nenhum ficheiro selecionado";
      fileInfo.classList.remove("active");
      separator.classList.remove("active");
      inputGroup.classList.remove("active");
      coverContainer.classList.remove("active");
      saveButton.style.display = "none";
    }
  });

  // Trigger cover image selection when the cover preview is clicked
  coverPreview.addEventListener("click", function () {
    coverInput.click();
  });

  // Update cover preview when a cover image is selected
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

  // Handle form submission with debugging for FormData entries
  uploadForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    if (!token) {
      alert("Você precisa estar logado para fazer upload de filmes.");
      return;
    }

    const title = movieTitle.value.trim();
    const year = movieYear.value.trim();
    const file = fileInput.files[0];

    // Basic validation: check if required fields are provided
    if (!title || !year || !file) {
      alert("Por favor, insira o nome, o ano e selecione um ficheiro.");
      return;
    }

    // Prepare FormData with movie metadata and file
    const formData = new FormData();
    formData.append("movieTitle", title);
    formData.append("movieYear", year);
    formData.append("movieFile", file);

    // Optionally include the cover image if provided
    if (coverInput.files && coverInput.files[0]) {
      formData.append("coverFile", coverInput.files[0]);
    }

    // Debug: Log all FormData entries
    for (let [key, value] of formData.entries()) {
      console.log(`FormData entry - ${key}:`, value);
    }

    try {
      // Disable button & show loading state
      saveButton.textContent = "Enviando...";
      saveButton.disabled = true;

      // Send FormData to backend (ensure the API route is correct)
      const response = await fetch("http://localhost:5000/api/auth/upload", {
        method: "POST",
        body: formData,
        headers: {
          "x-auth-token": token // Ensure token is properly sent
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao fazer upload do filme");
      }

      const data = await response.json();
      console.log("✅ Upload Successful:", data);
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

      // Optionally update the cover preview (if needed)
      if (data.movie.coverPath) {
        coverPreview.style.backgroundImage = `url(http://localhost:5000/${data.movie.coverPath})`;
      } else {
        coverPreview.style.backgroundImage = "";
      }
      coverPreview.textContent = "";

      // Redirect to library page after successful upload
      window.location.href = "library.html";
    } catch (error) {
      console.error("❌ Upload Error:", error);
      // If the error is due to an invalid token, prompt the user to log in again
      if (error.message.includes("Invalid token")) {
        alert("Seu token é inválido. Por favor, faça login novamente.");
        // Optionally, clear the token and redirect to the login page:
        // localStorage.removeItem("token");
        // window.location.href = "index.html";
      } else {
        alert("Ocorreu um erro durante o upload: " + error.message);
      }
      saveButton.textContent = "Salvar";
      saveButton.disabled = false;
    }
  });
});
