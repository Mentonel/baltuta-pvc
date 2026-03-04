document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".nav-toggle");
  const menu = document.querySelector(".nav-mobile");

  if (!toggle || !menu) return;

  const openMenu = () => {
    menu.hidden = false;
    menu.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
    const icon = toggle.querySelector("i");
    if (icon) icon.className = "fa-solid fa-xmark";
  };

  const closeMenu = () => {
    menu.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    const icon = toggle.querySelector("i");
    if (icon) icon.className = "fa-solid fa-bars";
    // mic delay ca să nu “flicăre” dacă adaugi animații pe viitor
    menu.hidden = true;
  };

  toggle.addEventListener("click", (e) => {
    e.stopPropagation();
    const isOpen = menu.classList.contains("is-open");
    isOpen ? closeMenu() : openMenu();
  });

  // click în afara meniului => închide
  document.addEventListener("click", (e) => {
    if (!menu.classList.contains("is-open")) return;
    if (!menu.contains(e.target) && !toggle.contains(e.target)) closeMenu();
  });

  // click pe un link din meniu => închide
  menu.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => closeMenu());
  });

  // dacă treci din mobil în desktop (resize) => închide
  window.addEventListener("resize", () => {
    if (window.innerWidth > 820 && menu.classList.contains("is-open")) {
      closeMenu();
    }
  });
});