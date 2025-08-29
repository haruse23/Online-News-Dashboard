// Wait for the DOM to fully load before executing the script
document.addEventListener("DOMContentLoaded", async () => {
  const loggedIn = sessionStorage.getItem("loggedIn") === "true";
  const email = sessionStorage.getItem("email");

  if (!loggedIn || !email) {
    window.location.href = "login.html";
    return;
  }

  const users = JSON.parse(localStorage.getItem("users")) || [];
  const currentUser = users.find(u => u.email === email);

  // Display current user's username and email
  const profileUsernameEl = document.getElementById("profile-username");
  const profileEmailEl = document.getElementById("profile-email");
  if (profileUsernameEl) profileUsernameEl.textContent = currentUser?.username || "N/A";
  if (profileEmailEl) profileEmailEl.textContent = currentUser?.email || "N/A";

  // Retrieve user's favorite articles from localStorage
  let userFavs = [];
  try {
    userFavs = JSON.parse(localStorage.getItem("favs_" + email)) || [];
  } catch { userFavs = []; }

  const favsContainer = document.getElementById("favs-container");

  if (userFavs.length === 0) {
    favsContainer.textContent = "No favorite articles selected.";
    return;
  }

  const safe = (v, fallback = "") => (v == null ? fallback : v);

  function renderFavorites() {
    favsContainer.innerHTML = "";
    if (userFavs.length === 0) {
      favsContainer.textContent = "No favorite articles selected.";
      return;
    }

    userFavs.forEach((item, idx) => {
      const card = document.createElement("div");
      card.className = "news-card";
      card.dataset.favIndex = idx;

      const img = document.createElement("img");
      img.src = safe(item.urlToImage, "https://via.placeholder.com/300x180?text=No+Image");
      img.alt = "News Image";
      img.onerror = () => { img.src = "https://via.placeholder.com/300x180?text=No+Image"; }

      const content = document.createElement("div");
      content.className = "news-content";

      const title = document.createElement("h3");
      title.className = "news-title";
      title.textContent = safe(item.title, "No title available");

      const desc = document.createElement("p");
      desc.className = "news-description";
      desc.textContent = safe(item.description, "");

      const meta = document.createElement("p");
      meta.className = "news-meta";
      meta.textContent = safe(item.source?.name, "") + (item.publishedAt ? " • " + new Date(item.publishedAt).toLocaleString() : "");

      const actions = document.createElement("div");
      actions.className = "news-actions";

      const readBtn = document.createElement("button");
      readBtn.className = "read-more btn";
      readBtn.dataset.idx = idx;
      readBtn.textContent = "Read More";

      const removeBtn = document.createElement("button");
      removeBtn.className = "remove-fav-btn btn";
      removeBtn.dataset.idx = idx;
      removeBtn.textContent = "Remove";

      actions.append(readBtn, removeBtn);
      content.append(title, meta, desc);
      card.append(img, content, actions);

      favsContainer.appendChild(card);
    });
  }

  renderFavorites();

  favsContainer.addEventListener("click", (e) => {
    const readBtn = e.target.closest(".read-more");
    const removeBtn = e.target.closest(".remove-fav-btn");

    if (readBtn) {
      const idx = Number(readBtn.dataset.idx);
      const fav = userFavs[idx];
      if (!fav) return;
      localStorage.setItem("selectedArticle", JSON.stringify(fav));
      window.location.href = "article.html";
      return;
    }

    if (removeBtn) {
      const idx = Number(removeBtn.dataset.idx);
      if (isNaN(idx)) return;
      userFavs.splice(idx, 1);
      localStorage.setItem("favs_" + email, JSON.stringify(userFavs));
      renderFavorites();
      return;
    }
  });
});
