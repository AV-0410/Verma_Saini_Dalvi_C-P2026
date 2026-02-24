// favorites page — shows saved businesses grouped by category

const grid = document.getElementById("favGrid");
const emptyState = document.getElementById("emptyState");

// we want categories in this specific order
const CATEGORY_ORDER = ["Food", "Retail", "Services", "Health/Fitness"];

function renderFavs() {
  const favIds = getFavorites();
  const all = getBusinesses();
  const list = all.filter(b => favIds.includes(b.id));

  if (list.length === 0) {
    emptyState.classList.remove("d-none");
    grid.innerHTML = "";
    return;
  }
  emptyState.classList.add("d-none");

  // group businesses into their categories
  const grouped = {};
  for (const b of list) {
    if (!grouped[b.category]) grouped[b.category] = [];
    grouped[b.category].push(b);
  }

  // only include categories that actually have saved businesses
  const categories = CATEGORY_ORDER.filter(c => grouped[c]);
  let html = "";

  for (const cat of categories) {
    html += `
      <div class="col-12 mt-3 mb-1">
        <div class="fav-category-heading">
          <span class="fav-category-label">${escapeHtml(cat)}</span>
          <span class="fav-category-count">${grouped[cat].length} saved</span>
        </div>
      </div>
      ${grouped[cat].map(businessCardHTML).join("")}
    `;
  }

  grid.innerHTML = html;

  // re-render the whole list when a favorite is toggled
  grid.querySelectorAll(".js-fav").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const id = btn.getAttribute("data-id");
      toggleFavorite(id);
      renderFavs();
    });
  });
}

renderFavs();