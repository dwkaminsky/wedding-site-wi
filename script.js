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
