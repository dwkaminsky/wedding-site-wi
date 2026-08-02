const tabs = [...document.querySelectorAll(".tab")];
const panels = [...document.querySelectorAll("main > .panel")];
const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".tabs");

function setActiveSection(panelId) {
  tabs.forEach((tab) => {
    const isActive = tab.hash === `#${panelId}`;
    tab.classList.toggle("active", isActive);
    if (isActive) tab.setAttribute("aria-current", "page");
    else tab.removeAttribute("aria-current");
  });
}

function closeMenu() {
  navigation.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
}

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    setActiveSection(tab.hash.slice(1));
    closeMenu();
  });
});

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  navigation.classList.toggle("open", !isOpen);
});

const observer = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (visible) setActiveSection(visible.target.id);
  },
  { rootMargin: "-20% 0px -60% 0px", threshold: [0, 0.1, 0.25, 0.5] },
);

panels.forEach((panel) => observer.observe(panel));
setActiveSection(window.location.hash.slice(1) || "home");
