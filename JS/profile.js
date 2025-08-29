
const email = sessionStorage.getItem("email");
const users = JSON.parse(localStorage.getItem("users")) || [];


const currentUser = users.find(u => u.email === email);


const favorites = JSON.parse(localStorage.getItem("favs_" + email)) || [];


const userInfoDiv = document.getElementById("userInfo");
const favList = document.getElementById("favoritesList");


if (currentUser) {
  userInfoDiv.innerHTML = `
    <h2 style="font-family:'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;">
      Username: ${currentUser.username}
    </h2>
    <h2 style="font-family:'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;">
      Email: ${currentUser.email}
    </h2>
  `;
} else {
  userInfoDiv.innerHTML = `
    <p style="font-family:'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif; font-size: 30px;">
      Please sign up or login first.
    </p>
  `;
}


favList.innerHTML = ""; 

if (favorites.length === 0) {
  favList.innerHTML = "<p>No favorite articles yet.</p>";
} else {
  favorites.forEach(article => {
    const card = document.createElement("div");
    card.className = "news-card"; 


    const img = document.createElement("img");
    img.src = article.urlToImage || "https://via.placeholder.com/300x180?text=No+Image";
    img.alt = "News Image";


    const content = document.createElement("div");
    content.className = "news-content";

    const title = document.createElement("h3");
    const a = document.createElement("a");
    a.textContent = article.title || "No title";
    a.href = article.url || "#";
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    title.appendChild(a);

    const meta = document.createElement("p");
    meta.className = "news-meta";
    meta.textContent =
      (article.source?.name ? article.source.name : "") +
      (article.author ? " • " + article.author : "") +
      (article.publishedAt ? " • " + new Date(article.publishedAt).toLocaleDateString() : "");

    const desc = document.createElement("p");
    desc.className = "news-description";
    desc.textContent = article.description || "";


    content.appendChild(title);
    content.appendChild(meta);
    content.appendChild(desc);

    card.appendChild(img);
    card.appendChild(content);

    favList.appendChild(card);
  });
}


