// Navbar injection, search handling, and theme application.
const pagesWithSearch = [
  "home.html",
  "search.html",
  "category-business.html",
  "category-health.html",
  "category-science.html",
  "category-sports.html",
  "category-technology.html",
];

const currentPage = window.location.pathname.split("/").pop();
const isLoggedIn = sessionStorage.getItem("loggedIn") === "true";

// Build navbar HTML (minimal, then inserted)
let navbarHTML = `
<nav class="navbar">
  <div class="logo"><a href="home.html">News Dashboard</a></div>

  <div class="links">
    <a href="home.html">Home</a>
    <div class="dropdown">
      <button class="dropbtn">Categories ▼</button>
      <div class="dropdown-content">
        <a href="category-business.html">Business</a>
        <a href="category-health.html">Health</a>
        <a href="category-science.html">Science</a>
        <a href="category-sports.html">Sports</a>
        <a href="category-technology.html">Technology</a>
      </div>
    </div>
    <a href="about.html">About</a>
  </div>

  <div class="nav-right">
`;

if (isLoggedIn) {
  navbarHTML += `
    <div class="profile-dropdown">
      <button class="profile-icon" aria-haspopup="true" aria-expanded="false">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      </button>
      <div class="dropdown-content2">
        <a href="profile.html">Profile</a>
        <a href="settings.html">Settings</a>
        <a href="#" id="logoutBtn">Logout</a>
      </div>
    </div>
  `;
} else {
  navbarHTML += `
    <div class="auth-buttons">
      <button class="btn-auth" onclick="window.location.href='signup.html'">Sign Up</button>
      <button class="btn-auth btn-login" onclick="window.location.href='login.html'">Login</button>
    </div>
  `;
}

navbarHTML += `</div></nav>`;

// Insert Search
if (pagesWithSearch.includes(currentPage)) {
  navbarHTML += `
    <form id="nav-search-form" class="nav-search" role="search">
      <input type="text" id="nav-search-input" placeholder="Search news..." aria-label="Search news" required>
      <button type="submit" class="search-btn" aria-label="Search">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
          <path d="M 21 3 C 11.6 3 4 10.6 4 20 C 4 29.4 11.6 37 21 37 C 24.354553 37 27.47104 36.01984 30.103516 34.347656 L 42.378906 46.621094 L 46.621094 42.378906 L 34.523438 30.279297 C 36.695733 27.423994 38 23.870646 38 20 C 38 10.6 30.4 3 21 3 z M 21 7 C 28.2 7 34 12.8 34 20 C 34 27.2 28.2 33 21 33 C 13.8 33 8 27.2 8 20 C 8 12.8 13.8 7 21 7 z"></path>
        </svg>
      </button>
    </form>
  `;
}

// Footer HTML
const footerHTML = `
<footer>
  <p>© 2025 News Dashboard | Powered by TEAM 5</p>
</footer>
`;

// Insert navbar & footer
document.body.insertAdjacentHTML("afterbegin", navbarHTML);
document.body.insertAdjacentHTML("beforeend", footerHTML);

// Apply theme
try {
  const username = sessionStorage.getItem("username") || "_anon";
  const theme = localStorage.getItem(`${username}_theme`) || "light";
  if (theme === "dark") document.body.classList.add("dark-mode");
  else document.body.classList.remove("dark-mode");
} catch (e) {
  console.warn("Failed to apply theme:", e);
}

// Handle Search Function
document.addEventListener("DOMContentLoaded", () => {
  const searchForm = document.getElementById("nav-search-form");
  if (searchForm) {
    searchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const query = document.getElementById("nav-search-input").value.trim();
      if (query) window.location.href = `search.html?q=${encodeURIComponent(query)}`;
    });
  }

  // Profile dropdown toggle
  const profileIcon = document.querySelector(".profile-icon");
  if (profileIcon) {
    const dropdownContent = document.querySelector(".dropdown-content2");
    profileIcon.addEventListener("click", (e) => {
      e.stopPropagation();
      dropdownContent.classList.toggle("show");
    });
    document.addEventListener("click", () => dropdownContent.classList.remove("show"));
  }

  // Logout
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      sessionStorage.clear();
      window.location.href = "home.html";
    });
  }
});
