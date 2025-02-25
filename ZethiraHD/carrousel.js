document.addEventListener("DOMContentLoaded", function () {
    const genreList = document.querySelector(".genre-list");
    const genresContainer = document.querySelector(".genres");

    function moveLeft() {
        genresContainer.scrollBy({ left: -150, behavior: "smooth" });
    }

    function moveRight() {
        genresContainer.scrollBy({ left: 150, behavior: "smooth" });
    }

    document.querySelector(".arrow-icon:first-child").addEventListener("click", moveLeft);
    document.querySelector(".arrow-icon:last-child").addEventListener("click", moveRight);
});
