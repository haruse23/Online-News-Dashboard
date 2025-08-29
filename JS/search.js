// Search page: query NewsAPI 'top-headlines', paginate locally, Read More -> article.html
const API_KEY = "734683adabb2428894a0a4cc3c411f68";

const CATEGORY_MAP = {
  tech: "technology",
  technology: "technology",
  business: "business",
  sport: "sports",
  sports: "sports",
  health: "health",
  science: "science",
  entertainment: "entertainment",
  general: "general"
};

document.addEventListener("DOMContentLoaded", async () => {
  // Detect category from referrer
  let category = null;
  const referrer = document.referrer;
  if (referrer) {
    const refFile = referrer.split("/").pop();
    if (refFile && refFile.startsWith("category-") && refFile.endsWith(".html")) {
      const slug = refFile.replace("category-", "").replace(".html", "").toLowerCase();
      category = CATEGORY_MAP[slug] || slug;
    }
  }

  const container = document.getElementById("news-container");
  const searchTitle = document.getElementById("search-title");
  const urlParams = new URLSearchParams(window.location.search);
  const query = urlParams.get("q");

  if (!query) {
    searchTitle.textContent = "No search query provided";
    container.innerHTML = "<p>Please enter a search term to find news articles.</p>";
    return;
  }

  const niceCat = category ? category.charAt(0).toUpperCase() + category.slice(1) : null;
  searchTitle.textContent = category
    ? `Search Results for: "${query}" in ${niceCat}`
    : `Search Results for: "${query}"`;

  container.innerHTML = "<p>Loading search results...</p>";

  const params = new URLSearchParams({
    apiKey: API_KEY,
    pageSize: "100",
    country: "us"
  });
  params.set("q", query);
  if (category) params.set("category", category);

  const apiUrl = `https://newsapi.org/v2/top-headlines?${params.toString()}`;

  const email = sessionStorage.getItem("email");
  const isLoggedIn = sessionStorage.getItem("loggedIn") === "true";

  let userFavs = [];
  if (isLoggedIn && email) {
    try { userFavs = JSON.parse(localStorage.getItem("favs_" + email)) || []; } 
    catch { userFavs = []; }
  }

  try {
    const res = await fetch(apiUrl);
    const data = await res.json();
    if (data.status === "error") throw new Error(data.message || "API Error");
    if (!data.articles || data.articles.length === 0) {
      container.innerHTML = `<p>No news articles found for "${query}".</p>`;
      return;
    }

    const lowerQ = query.toLowerCase();
    const allArticles = data.articles
      .filter(a => a.title && a.description && a.urlToImage)
      .filter(a => (a.title + " " + a.description).toLowerCase().includes(lowerQ))
      .sort((a, b) => ((b.title.toLowerCase().includes(lowerQ) ? 2 : 1) - (a.title.toLowerCase().includes(lowerQ) ? 2 : 1)));

    if (allArticles.length === 0) {
      container.innerHTML = `<p>No relevant results for "${query}".</p>`;
      return;
    }

    function isArticleFav(article) {
      return userFavs.some(a => a.url === article.url);
    }

    // Pagination setup
    let currentPage = 1;
    const articlesPerPage = 12;
    const totalPages = Math.ceil(allArticles.length / articlesPerPage);

    function renderPage(page) {
      currentPage = page;
      const start = (page - 1) * articlesPerPage;
      const pageArticles = allArticles.slice(start, start + articlesPerPage);

      container.innerHTML = pageArticles.map((article, idx) => {
        const fav = isLoggedIn && isArticleFav(article);
        return `
          <div class="news-card">
            <span class="fav-icon" data-idx="${start + idx}" title="${isLoggedIn ? 'Add/remove favourite' : 'Login to use favourites'}" style="${!isLoggedIn ? 'pointer-events:none;opacity:0.5;' : ''}">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="${fav ? '#f39c12' : 'none'}" stroke="#f39c12" stroke-width="2">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </span>
            <img src="${article.urlToImage}" alt="News Image" onerror="this.onerror=null;this.src='https://via.placeholder.com/300x180?text=No+Image';">
            <h3>${article.title}</h3>
            <p>${article.description}</p>
            <a href="article.html" class="readmore-btn" data-idx="${start + idx}">Read More</a>
          </div>
        `;
      }).join("");

      // Read More listener
      document.querySelectorAll(".readmore-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          const idx = Number(btn.dataset.idx);
          localStorage.setItem("selectedArticle", JSON.stringify(allArticles[idx]));
          window.location.href = "article.html";
        });
      });

      // Favourite icon listener
      if (isLoggedIn && email) {
        document.querySelectorAll(".fav-icon").forEach(icon => {
          icon.addEventListener("click", e => {
            e.stopPropagation();
            const idx = Number(icon.dataset.idx);
            const article = allArticles[idx];
            let favs = JSON.parse(localStorage.getItem("favs_" + email)) || [];
            const favIndex = favs.findIndex(a => a.url === article.url);
            const svg = icon.querySelector("svg");

            if (favIndex !== -1) {
              favs.splice(favIndex, 1);
              if (svg) svg.setAttribute("fill", "none");
            } else {
              favs.push(article);
              if (svg) svg.setAttribute("fill", "#f39c12");
            }

            localStorage.setItem("favs_" + email, JSON.stringify(favs));
          });
        });
      } else {
        document.querySelectorAll(".fav-icon").forEach(icon => {
          icon.addEventListener("click", e => {
            e.stopPropagation();
            alert("You must be logged in to use favourites!");
          });
        });
      }

      buildPagination();
    }

    function buildPagination() {
      document.getElementById("pagination-controls")?.remove();
      if (totalPages <= 1) return;

      const controls = document.createElement("div");
      controls.id = "pagination-controls";
      controls.style.textAlign = "center";
      controls.style.margin = "30px 0";
      controls.style.padding = "20px";

      const buttons = document.createElement("div");
      buttons.id = "pagination-buttons";

      if (currentPage > 1) {
        const prev = document.createElement("button");
        prev.textContent = "← Previous";
        prev.onclick = () => renderPage(currentPage - 1);
        buttons.appendChild(prev);
      }

      const startPage = Math.max(1, currentPage - 2);
      const endPage = Math.min(totalPages, currentPage + 2);
      for (let i = startPage; i <= endPage; i++) {
        const btn = document.createElement("button");
        btn.textContent = i;
        if (i === currentPage) btn.style.fontWeight = "bold";
        btn.onclick = () => renderPage(i);
        buttons.appendChild(btn);
      }

      if (currentPage < totalPages) {
        const next = document.createElement("button");
        next.textContent = "Next →";
        next.onclick = () => renderPage(currentPage + 1);
        buttons.appendChild(next);
      }

      controls.appendChild(buttons);
      container.insertAdjacentElement("afterend", controls);
    }

    renderPage(1);

  } catch (err) {
    console.error("Search error:", err);
    container.innerHTML = `<p>Error loading search results: ${err.message}</p>`;
  }
});
