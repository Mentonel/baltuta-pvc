// =============================
// GALERIE (Lucrări finalizate)
// Paginare 12 / pagină + Lightbox + Hamburger
// Compatibil Local + GitHub Pages (fetch relativ)
// =============================

const PAGE_SIZE = 12;

const gridEl = document.getElementById("modelsGrid");
const pageLabelEl = document.getElementById("pageLabel");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

let models = [];
let currentPage = 1;
let totalPages = 1;

function getPageFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const p = parseInt(params.get("page") || "1", 10);
  return Number.isFinite(p) && p >= 1 ? p : 1;
}

function setPageInUrl(page) {
  const url = new URL(window.location.href);
  url.searchParams.set("page", String(page));
  window.history.replaceState({}, "", url);
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function renderPage() {
  if (!gridEl) return;

  totalPages = Math.max(1, Math.ceil(models.length / PAGE_SIZE));
  currentPage = clamp(currentPage, 1, totalPages);

  const start = (currentPage - 1) * PAGE_SIZE;
  const pageModels = models.slice(start, start + PAGE_SIZE);

  gridEl.innerHTML = pageModels.map((m) => {
    const title = m.title || "Lucrare";
    const tag = m.tag || "Finalizat";

    return `
      <div class="model-card">
        <div class="model-media">
          <img src="${m.thumb || m.image}" alt="${title}" loading="lazy" width="600" height="400">
        </div>
        <div class="model-info">
          <h3>${title}</h3>
          <p>${tag}</p>
        </div>
      </div>
    `;
  }).join("");

  if (pageLabelEl) pageLabelEl.textContent = `Pagina ${currentPage} / ${totalPages}`;
  if (prevBtn) prevBtn.disabled = currentPage <= 1;
  if (nextBtn) nextBtn.disabled = currentPage >= totalPages;

  setPageInUrl(currentPage);
}

function bindPagination() {
  if (!prevBtn || !nextBtn) return;

  prevBtn.addEventListener("click", () => {
    currentPage -= 1;
    renderPage();
    document.getElementById("galerie")?.scrollIntoView({ behavior: "smooth" });
  });

  nextBtn.addEventListener("click", () => {
    currentPage += 1;
    renderPage();
    document.getElementById("galerie")?.scrollIntoView({ behavior: "smooth" });
  });
}

// IMPORTANT: relativ, fără "/" la început (merge pe GitHub Pages)
async function loadModels() {
  const res = await fetch("./modele_galerie.json", { cache: "no-store" });
  if (!res.ok) throw new Error("Nu pot încărca modele_galerie.json");

  const data = await res.json();
  if (!Array.isArray(data)) throw new Error("modele_galerie.json trebuie să fie un array.");

  models = data;
}

(async function init() {
  try {
    currentPage = getPageFromUrl();
    bindPagination();
    await loadModels();
    renderPage();
  } catch (err) {
    console.error(err);
    if (gridEl) {
      gridEl.innerHTML = `
        <div class="hero-card">
          <strong>Eroare:</strong> Nu s-au putut încărca pozele.
          <div class="muted" style="margin-top:8px;">
            Verifică dacă există <code>lucrari.json</code> și căile imaginilor.
          </div>
        </div>
      `;
    }
  }
})();

// ===== LIGHTBOX FUNCTIONALITY =====
let currentIndex = 0;

const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const closeBtn = document.querySelector(".lightbox-close");
const prevBtnLight = document.querySelector(".lightbox-prev");
const nextBtnLight = document.querySelector(".lightbox-next");

// Deschide lightbox
function openLightbox(index) {
  currentIndex = index;
  lightboxImg.src = models[index].image;
  lightbox.classList.add("active");
}

// Închide
function closeLightbox() {
  lightbox.classList.remove("active");
}

// Next / Prev
function showNext() {
  currentIndex = (currentIndex + 1) % models.length;
  lightboxImg.src = models[currentIndex].image;
}

function showPrev() {
  currentIndex = (currentIndex - 1 + models.length) % models.length;
  lightboxImg.src = models[currentIndex].image;
}

// Click pe imagine din grid
gridEl?.addEventListener("click", function (e) {
  const card = e.target.closest(".model-card");
  if (!card) return;

  const cards = Array.from(gridEl.children);
  const indexOnPage = cards.indexOf(card);
  const globalIndex = (currentPage - 1) * PAGE_SIZE + indexOnPage;

  openLightbox(globalIndex);
});

// Evenimente
closeBtn?.addEventListener("click", closeLightbox);
lightbox?.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightbox();
});

nextBtnLight?.addEventListener("click", showNext);
prevBtnLight?.addEventListener("click", showPrev);

// Tastatură
document.addEventListener("keydown", (e) => {
  if (!lightbox || !lightbox.classList.contains("active")) return;

  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowRight") showNext();
  if (e.key === "ArrowLeft") showPrev();
});

// ===== HAMBURGER MENU =====
(function () {
  const btn = document.querySelector(".menu-toggle");
  const nav = document.getElementById("site-nav");
  if (!btn || !nav) return;

  function closeMenu() {
    nav.classList.remove("open");
    btn.classList.remove("open");
    btn.setAttribute("aria-expanded", "false");
  }

  btn.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    btn.classList.toggle("open", isOpen);
    btn.setAttribute("aria-expanded", String(isOpen));
  });

  // Închide meniul când dai click pe un link (pe mobil)
  nav.querySelectorAll("a").forEach(a => a.addEventListener("click", closeMenu));

  // Închide meniul la resize spre desktop
  window.addEventListener("resize", () => {
    if (window.innerWidth > 720) closeMenu();
  });
})();
