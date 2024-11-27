// script.js
document.addEventListener("DOMContentLoaded", () => {
    const screens = document.querySelectorAll(".screen");
    const resultsContainer = document.getElementById("results");
    let selectedType = "";
    let apiKey = "YOUR_API_KEY_HERE"; // Substitua pelo seu
  
    const navigateTo = (screenIndex) => {
      screens.forEach((screen, i) => {
        screen.classList.toggle("active", i === screenIndex);
      });
    };
  
    document.getElementById("books-btn").addEventListener("click", () => {
      selectedType = "books";
      navigateTo(1);
    });
  
    document.getElementById("movies-btn").addEventListener("click", () => {
      selectedType = "movies";
      navigateTo(1);
    });
  
    document.getElementById("preferences-form").addEventListener("submit", async (e) => {
      e.preventDefault();
      const genre = document.getElementById("genre").value;
  
      const results = await fetchRecommendations(selectedType, genre);
      displayResults(results);
      navigateTo(2);
    });
  
    document.getElementById("back-btn").addEventListener("click", () => {
      navigateTo(0);
    });
  
    async function fetchRecommendations(type, genre) {
      let url = "";
      if (type === "books") {
        url = `https://www.googleapis.com/books/v1/volumes?q=${genre}`;
      } else if (type === "movies") {
        url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genre}`;
      }
  
      const response = await fetch(url);
      const data = await response.json();
      return type === "books" ? data.items : data.results;
    }
  
    function displayResults(results) {
      resultsContainer.innerHTML = results
        .map((item) => {
          const title = item.volumeInfo?.title || item.title;
          const description = item.volumeInfo?.description || item.overview;
          const image = item.volumeInfo?.imageLinks?.thumbnail || `https://image.tmdb.org/t/p/w200${item.poster_path}`;
  
          return `
            <div>
              <img src="${image}" alt="${title}" />
              <h3>${title}</h3>
              <p>${description ? description.substring(0, 100) + "..." : "Sem descrição disponível"}</p>
            </div>
          `;
        })
        .join("");
    }
  });
  