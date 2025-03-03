async function addMovie() {
  let title = document.getElementById("MovieTitle").value.trim();
  let genre = document.getElementById("MovieGenre").value.trim();
  let year = document.getElementById("MovieYear").value.trim();

  // Check if the input fields are empty
  if (title === "" || genre === "" || year === "") {
    let feedback = document.getElementById("feedbackMessage");
    feedback.style.display = "block";
    feedback.textContent = "Fields cannot be empty";
    feedback.className = "alert alert-danger text-center";

    setTimeout(() => {
      feedback.style.display = "none";
    }, 1000);
    return;
  }

  //Error handling for year
  if (isNaN(year) || year === "") {
    let feedback = document.getElementById("feedbackMessage");
    feedback.style.display = "block";
    feedback.textContent = "Year must be a number";
    feedback.className = "alert alert-danger text-center";

    setTimeout(() => {
      feedback.style.display = "none";
    }, 1000);
    return;
  }

  let posterPath = await fetchMoviePoster(title);

  let table = document.getElementById("MovieList");
  let rowIncrement = table.rows.length + 1;

  let newRow = document.createElement("tr");

  let rowCount = document.createElement("td");
  rowCount.textContent = rowIncrement;
  newRow.appendChild(rowCount);

  let rowPoster = document.createElement("td");
  let img = document.createElement("img");
  img.src = posterPath ? posterPath : "placeholder.jpg"; // Fallback image
  img.alt = title;
  img.style.width = "75px";
  img.style.height = "auto";
  rowPoster.appendChild(img);
  newRow.appendChild(rowPoster);

  let rowTitle = document.createElement("td");
  rowTitle.textContent = title;
  newRow.appendChild(rowTitle);

  let rowGenre = document.createElement("td");
  rowGenre.textContent = genre;
  newRow.appendChild(rowGenre);

  let rowYear = document.createElement("td");
  rowYear.textContent = year;
  newRow.appendChild(rowYear);

  let rowStatus = document.createElement("td");
  let statusSelect = document.createElement("select");
  statusSelect.className = "form-select";

  let options = ["To Watch", "Watching", "Watched"];
  for (let i = 0; i < options.length; i++) {
    let option = document.createElement("option");
    option.textContent = options[i];
    option.value = options[i];
    statusSelect.appendChild(option);
  }

  rowStatus.appendChild(statusSelect);
  newRow.appendChild(rowStatus);

  let deleteButton = document.createElement("button");
  let deleteCell = document.createElement("td");
  deleteButton.className = "btn btn-danger delete-btn";
  deleteButton.textContent = "Delete";
  deleteButton.addEventListener("click", function () {
    deleteMovie(this);
  });

  deleteCell.appendChild(deleteButton);
  newRow.appendChild(deleteCell);

  let ratingColumn = document.createElement("td");
  ratingColumn.className = "rating-column";
  ratingColumn.textContent = "Must watch movie first";
  newRow.appendChild(ratingColumn);

  table.appendChild(newRow);

  document.getElementById("MovieTitle").value = "";
  document.getElementById("MovieGenre").value = "";
  document.getElementById("MovieYear").value = "";

  let feedback = document.getElementById("feedbackMessage");
  feedback.style.display = "block";

  setTimeout(() => {
    feedback.style.display = "none";
  }, 2000);
}

async function fetchMoviePoster(title) {
  const apiKey = "a8b0d22d08f61aee9d7f71383e8dd5de";
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(
    title
  )}`;

  try {
    let response = await fetch(url);
    let data = await response.json();

    if (data.results.length > 0) {
      return `https://image.tmdb.org/t/p/w500${data.results[0].poster_path}`;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching movie poster:", error);
    return null;
  }
}

function deleteMovie(button) {
  let row = button.closest("tr");
  if (row) {
    row.remove();
  }
  let feedback = document.getElementById("feedbackMessage");
  feedback.style.display = "block";
  feedback.textContent = "Movie deleted successfully";
  feedback.className = "alert alert-danger text-center";

  setTimeout(() => {
    feedback.style.display = "none";
    feedback.textContent = "Movie added successfully";
    feedback.className = "alert alert-success text-center";
  }, 2000);

  let table = document.getElementById("MovieList");
  let rows = table.rows;
  for (let i = 0; i < rows.length; i++) {
    rows[i].cells[0].textContent = i + 1;
  }
}

let deleteButtons = document.getElementsByClassName("delete-btn");
for (let i = 0; i < deleteButtons.length; i++) {
  deleteButtons[i].addEventListener("click", function () {
    deleteMovie(this);
  });
}

function searchMovies() {
  const searchInput = document
    .getElementById("searchInput")
    .value.toLowerCase();
  const table = document.getElementById("MovieList");
  const rows = table.getElementsByTagName("tr");

  for (let i = 0; i < rows.length; i++) {
    const titleCell = rows[i].getElementsByTagName("td")[2];
    const genreCell = rows[i].getElementsByTagName("td")[3];

    if (titleCell && genreCell) {
      const titleText = titleCell.textContent.toLowerCase();
      const genreText = genreCell.textContent.toLowerCase();

      if (titleText.includes(searchInput) || genreText.includes(searchInput)) {
        rows[i].style.display = "";
      } else {
        rows[i].style.display = "none";
      }
    }
  }
}

document
  .getElementById("MovieList")
  .addEventListener("change", function (event) {
    let target = event.target;

    if (
      target.tagName === "SELECT" &&
      !target.classList.contains("rating-select")
    ) {
      let row = target.closest("tr");
      let ratingColumn = row.querySelector(".rating-column");

      if (target.value === "Watched") {
        ratingColumn.innerHTML = "";

        let ratingSelect = document.createElement("select");
        ratingSelect.className = "form-select rating-select";

        for (let i = 1; i <= 5; i++) {
          let option = document.createElement("option");
          option.value = i;
          option.textContent = "⭐".repeat(i);
          ratingSelect.appendChild(option);
        }

        ratingColumn.appendChild(ratingSelect);

        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } else {
        ratingColumn.innerHTML = "Must watch movie first";
      }
    }
  });

document.getElementById("AddMovie").addEventListener("click", addMovie);

const searchInput = document.getElementById("searchInput");
if (searchInput) {
  searchInput.addEventListener("keyup", searchMovies);
}
