// Fetch top headlines and render cards. Read More saves article to localStorage and navigates to article.html.
document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("news-container");
  const apiKey = "734683adabb2428894a0a4cc3c411f68";
  const url = `https://newsapi.org/v2/top-headlines?country=us&pageSize=50&apiKey=${apiKey}`;

  // Current user
  const email = sessionStorage.getItem("email");
  const isLoggedIn = sessionStorage.getItem("loggedIn") === "true";

  // Load user favorites (object only)
  let userFavs = [];
  if (isLoggedIn && email) {
    try {
      userFavs = JSON.parse(localStorage.getItem("favs_" + email)) || [];
    } catch {
      userFavs = [];
    }
  }

  try {
    const res = await fetch(url);
    const data = await res.json();
    if (!data.articles || data.articles.length === 0) {
      container.innerHTML = "<p>No articles available.</p>";
      return;
    }

    // Check if an article is favourited
    const isArticleFav = (article) => {
      return userFavs.some((item) => item && item.url === article.url);
    };

    // Render cards
    container.innerHTML = data.articles.map((article, idx) => {
      const imgSrc = article.urlToImage || "https://via.placeholder.com/300x180?text=No+Image";
      const isFav = isLoggedIn && isArticleFav(article);
      return `
        <div class="news-card" data-idx="${idx}">
          <span class="fav-icon" data-idx="${idx}" title="${isLoggedIn ? 'Add/remove favourite' : 'Login to use favourites'}" style="${!isLoggedIn ? 'pointer-events:none;opacity:0.5;' : ''}">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="${isFav ? '#f39c12' : 'none'}" stroke="#f39c12" stroke-width="2">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </span>
          <img src="${imgSrc}" alt="" onerror="this.onerror=null;this.src='https://via.placeholder.com/300x180?text=No+Image';" />
          <h3>${article.title || "No title available"}</h3>
          <p>${article.description || "No description available."}</p>
          <a href="article.html" class="readmore-btn" data-idx="${idx}">Read More</a>
        </div>
      `;
    }).join("");

    // Attach Read More listeners
    document.querySelectorAll(".readmore-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const idx = Number(btn.dataset.idx);
        localStorage.setItem("selectedArticle", JSON.stringify(data.articles[idx]));
        window.location.href = "article.html";
      });
    });

    // Attach favourite icon listeners
    if (isLoggedIn && email) {
      document.querySelectorAll(".fav-icon").forEach((icon) => {
        icon.addEventListener("click", (e) => {
          e.stopPropagation();
          const idx = Number(icon.dataset.idx);
          const selectedArticle = data.articles[idx];
          if (!selectedArticle) return;

          let favs = JSON.parse(localStorage.getItem("favs_" + email)) || [];
          const favIndex = favs.findIndex((item) => item && item.url === selectedArticle.url);
          const svg = icon.querySelector("svg");

          if (favIndex !== -1) {
            favs.splice(favIndex, 1);
            if (svg) svg.setAttribute("fill", "none");
          } else {
            favs.push(selectedArticle);
            if (svg) svg.setAttribute("fill", "#f39c12");
          }

          localStorage.setItem("favs_" + email, JSON.stringify(favs));
        });
      });
    } else {
      document.querySelectorAll(".fav-icon").forEach((icon) => {
        icon.addEventListener("click", (e) => {
          e.stopPropagation();
          alert("You must be logged in to use favourites!");
        });
      });
    }

  } catch (err) {
    console.error("Error loading headlines:", err);
    container.innerHTML = "<p>Error loading news.</p>";
  }
});
