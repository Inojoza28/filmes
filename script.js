document.addEventListener("DOMContentLoaded", () => {
    const screens = document.querySelectorAll(".screen");
    const resultsContainer = document.getElementById("results");
    let selectedType = "";
    let apiKey = "46b7143882afae316bec91b9d2446d73"; // Substitua pela chave correta
  
    const navigateTo = (screenIndex) => {
        screens.forEach((screen, i) => {
            screen.classList.toggle("active", i === screenIndex);
        });
    };

    // Seleção entre livros e filmes
    document.getElementById("books-btn").addEventListener("click", () => {
        selectedType = "books";
        navigateTo(1);
    });

    document.getElementById("movies-btn").addEventListener("click", () => {
        selectedType = "movies";
        navigateTo(1);
    });

    // Ao enviar o formulário
    document.getElementById("preferences-form").addEventListener("submit", async (e) => {
        e.preventDefault();
        const genre = document.getElementById("genre").value;
  
        const results = await fetchRecommendations(selectedType, genre);
        displayResults(results);
        navigateTo(2);
    });

    // Voltar para a tela inicial
    document.getElementById("back-btn").addEventListener("click", () => {
        navigateTo(0);
    });

    // Função para buscar recomendações
    async function fetchRecommendations(type, genre) {
        let url = "";
        if (type === "books") {
            url = `https://www.googleapis.com/books/v1/volumes?q=${genre}`;
        } else if (type === "movies") {
            // Usando o código do gênero para a API TMDb
            const genreCode = mapGenreToTMDb(genre); // Mapeia o gênero selecionado para código TMDb
            url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genreCode}`;
        }
  
        try {
            const response = await fetch(url);
            const data = await response.json();
            console.log(data); // Para depuração
            return type === "books" ? data.items : data.results;
        } catch (error) {
            console.error("Erro ao buscar dados:", error);
            return []; // Retorna um array vazio em caso de erro
        }
    }

    // Mapeia os gêneros selecionados para o formato esperado pelo TMDb
    function mapGenreToTMDb(genre) {
        const genreMap = {
            fantasy: 14,
            romance: 10749,
            action: 28,
            comedy: 35
        };
        return genreMap[genre] || ""; // Retorna o código do gênero ou string vazia se não encontrado
    }

    // Função para exibir os resultados
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
