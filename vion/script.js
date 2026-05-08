let currentCategory = "all";
let searchQuery = "";
let moviesData = [];

fetch('movies.json')
    .then(res => res.json())
    .then(data => {
        moviesData = data;
        renderMovies();
    });

function renderMovies() {
    let filtered = [...moviesData];
    
    if (searchQuery) {
        filtered = filtered.filter(m => m.title.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    
    if (currentCategory === "movie") {
        filtered = filtered.filter(m => m.type === "movie");
    } else if (currentCategory === "series") {
        filtered = filtered.filter(m => m.type === "series");
    } else if (currentCategory === "top") {
        filtered = [...filtered].sort((a,b) => b.rating - a.rating).slice(0, 50);
    }
    
    const container = document.getElementById("moviesContainer");
    const titleEl = document.getElementById("dynamicTitle");
    
    if (currentCategory === "top") titleEl.innerText = "🏆 Топ-250";
    else if (currentCategory === "movie") titleEl.innerText = "🎬 Фильмы";
    else if (currentCategory === "series") titleEl.innerText = "📺 Сериалы";
    else titleEl.innerText = "🔥 Популярное в VION";
    
    if (filtered.length === 0) {
        container.innerHTML = `<div style="grid-column:1/-1; text-align:center; padding:60px;">Ничего не найдено</div>`;
        return;
    }
    
    container.innerHTML = filtered.map(movie => `
        <div class="movie-card" data-id="${movie.id}">
            <div class="poster">
                <img src="${movie.poster}" alt="${movie.title}" onerror="this.src='https://via.placeholder.com/300x450/1e293b/e2e8f0?text=Постер'">
            </div>
            <div class="movie-info">
                <div class="movie-title">${movie.title} (${movie.year})</div>
                <div class="movie-meta">
                    <span>⭐ ${movie.rating}</span>
                    <span class="ru-badge">🇷🇺 Рус</span>
                </div>
            </div>
        </div>
    `).join("");
    
    document.querySelectorAll('.movie-card').forEach(card => {
        card.addEventListener('click', () => {
            const id = card.getAttribute('data-id');
            window.location.href = `player.html?id=${id}`;
        });
    });
}

document.getElementById("searchInput").addEventListener("input", (e) => {
    searchQuery = e.target.value;
    renderMovies();
});

document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", () => {
        document.querySelectorAll(".nav-link").forEach(l => l.classList.remove("active"));
        link.classList.add("active");
        currentCategory = link.getAttribute("data-category");
        renderMovies();
    });
});