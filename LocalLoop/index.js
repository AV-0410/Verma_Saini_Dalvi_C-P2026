// browse page logic — filtering, sorting, and rendering the business grid

const grid = document.getElementById("businessGrid");
const statusLine = document.getElementById("statusLine");
const searchInput = document.getElementById("searchInput");
const categorySelect = document.getElementById("categorySelect");
const sortSelect = document.getElementById("sortSelect");

function getFilteredSortedBusinesses() {
  const all = getBusinesses();
  const q = searchInput.value.trim().toLowerCase();
  const cat = categorySelect.value;
  const sort = sortSelect.value;

  // filter by category and search query
  let list = all.filter(b => {
    const matchesCat = (cat === "All") || (b.category === cat);
    const hay = `${b.name} ${b.description} ${(b.keywords || []).join(" ")}`.toLowerCase();
    const matchesQ = q === "" || hay.includes(q);
    return matchesCat && matchesQ;
  });

  // sort the results
  if (sort === "rating_desc") {
    list.sort((a, b) => getBizStats(b.id).avg - getBizStats(a.id).avg);
  } else if (sort === "reviews_desc") {
    list.sort((a, b) => getBizStats(b.id).count - getBizStats(a.id).count);
  } else if (sort === "az") {
    list.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sort === "za") {
    list.sort((a, b) => b.name.localeCompare(a.name));
  }

  return list;
}

function render() {
  const list = getFilteredSortedBusinesses();
  statusLine.textContent = `${list.length} business${list.length === 1 ? "" : "es"} shown`;

  grid.innerHTML = list.map(businessCardHTML).join("");

  // wire up favorite buttons after cards are rendered
  grid.querySelectorAll(".js-fav").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const id = btn.getAttribute("data-id");
      const nowFav = toggleFavorite(id);
      btn.className = `btn btn-sm ${nowFav ? "btn-dark" : "btn-outline-dark"} js-fav`;
    });
  });
}

// re-render whenever the user types or changes a filter
["input", "change"].forEach(evt => {
  searchInput.addEventListener(evt, render);
});
categorySelect.addEventListener("change", render);
sortSelect.addEventListener("change", render);

render();