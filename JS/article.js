// Read article object from localStorage and render a detailed article view.
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("article-content");
  const raw = localStorage.getItem("selectedArticle");
  if (!raw) {
    container.innerHTML = `<p>⚠️ No article found. Go back to <a href="home.html">Home</a>.</p>`;
    return;
  }

  const article = JSON.parse(raw);

  const publishedDate = article.publishedAt ? new Date(article.publishedAt).toLocaleString() : "Unknown date";

  container.innerHTML = `
    <h1 class="article-title">${article.title || "Untitled Article"}</h1>

    <div class="meta">
      <span><strong>Author:</strong> ${article.author || "Unknown"}</span>
      <span><strong>Source:</strong> ${article.source?.name || "Unknown"}</span>
      <span><strong>Published:</strong> ${publishedDate}</span>
    </div>

    ${article.urlToImage ? `<img class="article-image" src="${article.urlToImage}" alt="Article image">` : ""}

    <div class="article-body">
      <p class="description">${article.description || ""}</p>
      <p class="content">${article.content || ""}</p>
    </div>

    <div style="display:flex;gap:10px;align-items:center;">
      <a href="${article.url}" target="_blank" rel="noopener noreferrer" class="source-link">Read Full Article at Source</a>
    </div>
  `;

  // Back button returns to previous page
  const backBtn = document.getElementById("backBtn");
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      window.history.back();
    });
  }
});
