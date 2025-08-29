// Per-user settings saved into localStorage using <username>_key naming.
const KEYS = {
  categories: "categoryButtons",
  theme: "theme",
  notif: "notifButton",
  layout: "layout",
};

const currentSettings = {
  categories: [],
  theme: "light",
  notif: "on",
  layout: "list",
};

// Utilities
const USER = () => sessionStorage.getItem("username") || "_anon";
const k = (base) => `${USER()}_${base}`;

// DOM ready: initialize UI and handlers
document.addEventListener("DOMContentLoaded", () => {
  loadSavedSettingsToUI();

  // Setup controls
  setupButtonGroup("categoryButtons", false);
  setupButtonGroup("displayButtons", true);
  setupButtonGroup("notifButton", true);
  setupButtonGroup("layoutButtons", true);

  // Save button
  const saveBtn = document.getElementById("saveBtn");
  if (saveBtn) {
    saveBtn.addEventListener("click", async () => {
      await saveAllSettings();
      alert("Settings saved and applied!");
      window.location.href = "home.html";
    });
  }
});

// Load settings for the current user into UI state
function loadSavedSettingsToUI() {
  try {
    const rawCats = localStorage.getItem(k(KEYS.categories));
    if (rawCats) currentSettings.categories = JSON.parse(rawCats);

    currentSettings.theme = localStorage.getItem(k(KEYS.theme)) || "light";
    currentSettings.notif = localStorage.getItem(k(KEYS.notif)) || "on";
    currentSettings.layout = localStorage.getItem(k(KEYS.layout)) || "list";
  } catch (e) {
    console.warn("Failed to read saved settings:", e);
  }

  // Sync buttons
  applyButtonsStateFromCurrent("categoryButtons");
  applyButtonsStateFromCurrent("displayButtons");
  applyButtonsStateFromCurrent("notifButton");
  applyButtonsStateFromCurrent("layoutButtons");
  applyThemePreview(currentSettings.theme);
}

function applyButtonsStateFromCurrent(groupId) {
  const group = document.getElementById(groupId);
  if (!group) return;
  const buttons = Array.from(group.querySelectorAll("button"));

  if (groupId === "categoryButtons") {
    buttons.forEach((b) => {
      b.classList.toggle("active", currentSettings.categories.includes(b.dataset.value));
    });
    applyCategoryHighlight(group);
    return;
  }

  if (groupId === "displayButtons") {
    buttons.forEach((b) => b.classList.toggle("active", b.dataset.value === currentSettings.theme));
    return;
  }

  if (groupId === "notifButton") {
    buttons.forEach((b) => b.classList.toggle("active", b.dataset.value === currentSettings.notif));
    return;
  }

  if (groupId === "layoutButtons") {
    buttons.forEach((b) => b.classList.toggle("active", b.dataset.value === currentSettings.layout));
    return;
  }
}

function setupButtonGroup(groupId, singleSelect = true) {
  const group = document.getElementById(groupId);
  if (!group) return;
  const buttons = Array.from(group.querySelectorAll("button"));

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (singleSelect) {
        buttons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
      } else {
        btn.classList.toggle("active");
      }

      // Update memory-only settings
      if (groupId === "categoryButtons") {
        currentSettings.categories = buttons.filter((b) => b.classList.contains("active")).map((b) => b.dataset.value);
        applyCategoryHighlight(group);
      } else if (groupId === "displayButtons") {
        currentSettings.theme = btn.dataset.value;
      } else if (groupId === "notifButton") {
        const active = buttons.find((b) => b.classList.contains("active"));
        currentSettings.notif = active ? active.dataset.value : "off";
      } else if (groupId === "layoutButtons") {
        const active = buttons.find((b) => b.classList.contains("active"));
        currentSettings.layout = active ? active.dataset.value : currentSettings.layout;
      }
    });
  });
}

// Save settings for the current user
async function saveAllSettings() {
  try {
    localStorage.setItem(k(KEYS.categories), JSON.stringify(currentSettings.categories));
    localStorage.setItem(k(KEYS.theme), currentSettings.theme);
    localStorage.setItem(k(KEYS.notif), currentSettings.notif);
    localStorage.setItem(k(KEYS.layout), currentSettings.layout);

    // Notification permission (per-user)
    if (currentSettings.notif === "on") {
      if ("Notification" in window) {
        try {
          const permission = await Notification.requestPermission();
          localStorage.setItem(k("notification_permission"), permission);
          if (permission === "granted") {
            try {
              new Notification("Notifications enabled", { body: "You'll receive notifications from this site." });
            } catch (e) {
              console.warn("Could not show test notification:", e);
            }
          }
        } catch (e) {
          console.error("Notification permission request failed:", e);
        }
      } else {
        alert("Your browser doesn't support Notifications API.");
      }
    }

    applyThemePreview(currentSettings.theme);
  } catch (e) {
    console.error("Failed to save settings:", e);
  }
}

function applyThemePreview(theme) {
  if (theme === "dark") document.body.classList.add("dark-mode");
  else document.body.classList.remove("dark-mode");
}

function applyCategoryHighlight(group) {
  const buttons = group.querySelectorAll("button");
  buttons.forEach((b) => b.classList.toggle("category-gold", b.classList.contains("active")));
}
