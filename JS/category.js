const API_KEY = "734683adabb2428894a0a4cc3c411f68";

document.addEventListener("DOMContentLoaded", async () => {
  const category = document.body.dataset.category || "general";
  const categoryTitle = document.getElementById("category-title");
  const newsContainer = document.getElementById("news-container");

  // Set page title
  if (categoryTitle) categoryTitle.innerText = category.charAt(0).toUpperCase() + category.slice(1);

  const email = sessionStorage.getItem("email");
  const isLoggedIn = sessionStorage.getItem("loggedIn") === "true";

  let articles = [];

  // Fetch articles or favourites
  if (category.toLowerCase() === "favourites") {
    if (!isLoggedIn || !email) {
      newsContainer.innerHTML = "<p>Login to see your favourite articles.</p>";
      return;
    }
    try {
      articles = JSON.parse(localStorage.getItem("favs_" + email)) || [];
    } catch { articles = []; }

    if (articles.length === 0) {
      newsContainer.innerHTML = "<p>No favourite articles selected.</p>";
      return;
    }
  } else {
    try {
      const res = await fetch(`https://newsapi.org/v2/top-headlines?category=${category}&language=en&pageSize=12&apiKey=${API_KEY}`);
      const data = await res.json();
      articles = data.articles || [];
      if (articles.length === 0) {
        newsContainer.innerHTML = "<p>No articles found.</p>";
        return;
      }
    } catch {
      newsContainer.innerHTML = "<p>Error loading news.</p>";
      return;
    }
  }

  const safe = (v, fallback = "") => (v == null ? fallback : v);

  // Load user favourites
  let userFavs = [];
  if (isLoggedIn && email) {
    try {
      userFavs = JSON.parse(localStorage.getItem("favs_" + email)) || [];
    } catch {}
  }

  const isArticleFav = (article) => userFavs.some((item) => item && item.url === article.url);

  newsContainer.innerHTML = "";

  // Render articles
  articles.forEach((article, i) => {
    const imgSrc = safe(article.urlToImage, "https://via.placeholder.com/300x180?text=No+Image");
    const isFav = isLoggedIn && isArticleFav(article);

    const card = document.createElement("div");
    card.className = "news-card";

    card.innerHTML = `
      <span class="fav-icon" data-idx="${i}" style="${!isLoggedIn ? 'pointer-events:none;opacity:0.5;' : ''}">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="${isFav ? '#f39c12' : 'none'}" stroke="#f39c12" stroke-width="2">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
      </span>
      <img src="${imgSrc}" alt="" onerror="this.onerror=null;this.src='https://via.placeholder.com/300x180?text=No+Image';" />
      <div class="news-content">
        <div class="news-title">${safe(article.title, "No title")}</div>
        <div class="news-description">${safe(article.description, "No description")}</div>
      </div>
      <a href="article.html" class="readmore-btn" data-idx="${i}">Read More</a>
    `;

    // Read More click
    card.querySelector(".readmore-btn").addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.setItem("selectedArticle", JSON.stringify(article));
      window.location.href = "article.html";
    });

    newsContainer.appendChild(card);
  });

  // Delegated favourite icon click
  newsContainer.addEventListener("click", function (e) {
    const icon = e.target.closest(".fav-icon");
    if (!icon) return;

    if (!isLoggedIn || !email) {
      alert("You must be logged in to use favourites!");
      return;
    }

    let favs = [];
    try { favs = JSON.parse(localStorage.getItem("favs_" + email)) || []; } catch {}

    const idx = Number(icon.getAttribute("data-idx"));
    if (typeof articles[idx] === "undefined") return;
    const selectedArticle = articles[idx];

    const svg = icon.querySelector("svg");
    const favIndex = favs.findIndex(a => a && a.url === selectedArticle.url);

    if (favIndex !== -1) {
      favs.splice(favIndex, 1);
      if (svg) svg.setAttribute("fill", "none");

      // If on Favourites page, remove card immediately
      if (category.toLowerCase() === "favourites") {
        const card = icon.closest(".news-card");
        if (card) card.remove();
      }

    } else {
      favs.push(selectedArticle);
      if (svg) svg.setAttribute("fill", "#f39c12");
    }

    localStorage.setItem("favs_" + email, JSON.stringify(favs));
  });

});
