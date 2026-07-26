const PASSWORD_HASH = "c693e6d3f225ed7c9a1c09fccea45db5f0d9512e3abdeb3e75a9aabb1eabdc53";
const ACCESS_KEY = "wedding-site-access";
const passwordGate = document.querySelector("#password-gate");
const passwordForm = document.querySelector("#password-form");
const passwordInput = document.querySelector("#site-password");
const passwordError = document.querySelector("#password-error");

async function hashPassword(value) {
  const encoded = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", encoded);
  return [...new Uint8Array(digest)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function unlockSite() {
  document.body.classList.remove("site-locked");
  passwordGate.classList.add("unlocked");
  passwordGate.setAttribute("aria-hidden", "true");
}

if (sessionStorage.getItem(ACCESS_KEY) === PASSWORD_HASH) {
  unlockSite();
} else {
  requestAnimationFrame(() => passwordInput.focus());
}

passwordForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  passwordForm.classList.remove("has-error");
  passwordError.textContent = "";

  const submittedHash = await hashPassword(passwordInput.value);

  if (submittedHash === PASSWORD_HASH) {
    sessionStorage.setItem(ACCESS_KEY, PASSWORD_HASH);
    passwordInput.value = "";
    unlockSite();
    document.querySelector(".site-header").focus({ preventScroll: true });
    return;
  }

  passwordForm.classList.add("has-error");
  passwordError.textContent = "That password doesn't match. Please try again.";
  passwordInput.select();
});

const tabs = [...document.querySelectorAll(".tab")];
const panels = [...document.querySelectorAll(".panel")];
const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".tabs");

function showPanel(panelId, updateHistory = true) {
  const nextPanel = document.getElementById(panelId);

  if (!nextPanel) return;

  tabs.forEach((tab) => {
    const isActive = tab.dataset.tab === panelId;
    tab.classList.toggle("active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
    tab.tabIndex = isActive ? 0 : -1;
  });

  panels.forEach((panel) => {
    const isActive = panel.id === panelId;
    panel.hidden = !isActive;
    panel.classList.toggle("active", isActive);
  });

  navigation.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");

  if (updateHistory) {
    history.replaceState(null, "", `#${panelId}`);
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

tabs.forEach((tab, index) => {
  tab.addEventListener("click", () => showPanel(tab.dataset.tab));

  tab.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;

    event.preventDefault();
    let nextIndex = index;

    if (event.key === "ArrowRight") nextIndex = (index + 1) % tabs.length;
    if (event.key === "ArrowLeft") nextIndex = (index - 1 + tabs.length) % tabs.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = tabs.length - 1;

    tabs[nextIndex].focus();
    showPanel(tabs[nextIndex].dataset.tab);
  });
});

document.querySelectorAll("[data-go-to]").forEach((button) => {
  button.addEventListener("click", () => showPanel(button.dataset.goTo));
});

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  navigation.classList.toggle("open", !isOpen);
});

window.addEventListener("hashchange", () => {
  showPanel(window.location.hash.slice(1) || "home", false);
});

showPanel(window.location.hash.slice(1) || "home", false);
