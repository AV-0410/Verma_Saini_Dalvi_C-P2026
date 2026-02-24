// shared functions used across multiple pages
// keeps things DRY so we're not copy-pasting the same logic everywhere

initData();

// check if a deal is still valid based on today's date
function isDealActive(deal) {
  if (!deal) return false;
  const today = new Date();
  const exp = new Date(deal.expires + "T23:59:59");
  return exp >= today;
}

function getBizById(id) {
  return getBusinesses().find(b => b.id === id) || null;
}

// calculate average rating and review count for a given business
function getBizStats(bizId) {
  const reviewsMap = getReviewsMap();
  const reviews = reviewsMap[bizId] || [];
  const count = reviews.length;
  const avg = count === 0 ? 0 : (reviews.reduce((s, r) => s + Number(r.rating), 0) / count);
  return { avg, count };
}

function formatRating(avg, count) {
  if (count === 0) return "⭐ No ratings yet";
  return `⭐ ${avg.toFixed(1)} (${count} review${count === 1 ? "" : "s"})`;
}

function isFavorited(bizId) {
  return getFavorites().includes(bizId);
}

// toggles a business in/out of favorites and returns the new state
function toggleFavorite(bizId) {
  const favs = getFavorites();
  const idx = favs.indexOf(bizId);
  if (idx >= 0) favs.splice(idx, 1);
  else favs.push(bizId);
  setFavorites(favs);
  return favs.includes(bizId);
}

// builds the HTML for a single business card
// used on both the browse page and favorites page
function businessCardHTML(b) {
  const { avg, count } = getBizStats(b.id);
  const fav = isFavorited(b.id);
  const dealActive = isDealActive(b.deal);

  // pick badge color based on category
  const badgeClass =
    b.category === "Food" ? "text-bg-warning" :
      b.category === "Retail" ? "text-bg-info" :
        b.category === "Services" ? "text-bg-primary" :
          "text-bg-success";

  return `
    <div class="col-12 col-md-6 col-lg-4">
      <div class="card h-100 shadow-sm">
        <div class="card-body d-flex flex-column">
          <div class="d-flex justify-content-between align-items-start gap-2">
            <div>
              <h5 class="card-title mb-1">${escapeHtml(b.name)}</h5>
              <span class="badge ${badgeClass}">${escapeHtml(b.category)}</span>
            </div>
            <button class="btn btn-sm ${fav ? "btn-dark" : "btn-outline-dark"} js-fav" data-id="${b.id}" title="Toggle favorite">
              ⭐
            </button>
          </div>

          <div class="text-secondary mt-2">${formatRating(avg, count)}</div>

          ${dealActive ? `
            <div class="mt-2">
              <span class="badge text-bg-success">Deal Active</span>
              <span class="small text-secondary ms-1">${escapeHtml(b.deal.title)}</span>
            </div>
          ` : ""}

          <p class="mt-2 mb-3 small text-secondary">${escapeHtml(b.description)}</p>

          <div class="mt-auto d-flex gap-2">
            <a class="btn btn-outline-dark w-100" href="business.html?id=${encodeURIComponent(b.id)}">View</a>
          </div>
        </div>
      </div>
    </div>
  `;
}

// prevent XSS by escaping any user-provided strings before putting them in the DOM
function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}