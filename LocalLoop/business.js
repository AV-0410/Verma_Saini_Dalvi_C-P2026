// business detail page — loads a single business by id from the URL

function getQueryParam(name) {
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
}

const bizId = getQueryParam("id");
const biz = bizId ? getBizById(bizId) : null;

// grab all the DOM elements we'll be updating
const els = {
  name: document.getElementById("bizName"),
  category: document.getElementById("bizCategory"),
  rating: document.getElementById("bizRating"),
  desc: document.getElementById("bizDesc"),
  address: document.getElementById("bizAddress"),
  phone: document.getElementById("bizPhone"),
  hours: document.getElementById("bizHours"),
  favBtn: document.getElementById("favBtn"),
  dealCard: document.getElementById("dealCard"),
  dealTitle: document.getElementById("dealTitle"),
  dealCode: document.getElementById("dealCode"),
  dealExpiry: document.getElementById("dealExpiry"),
  reviewsList: document.getElementById("reviewsList"),
  noReviews: document.getElementById("noReviews"),
  ratingInput: document.getElementById("ratingInput"),
  commentInput: document.getElementById("commentInput"),
  captchaQuestion: document.getElementById("captchaQuestion"),
  captchaInput: document.getElementById("captchaInput"),
  newCaptchaBtn: document.getElementById("newCaptchaBtn"),
  submitBtn: document.getElementById("submitReviewBtn"),
  formMsg: document.getElementById("formMsg")
};

// if the id is invalid or missing, just show an error and stop
if (!biz) {
  document.body.innerHTML = `<div class="container my-5">
    <div class="alert alert-danger">Business not found. <a href="index.html">Go back</a>.</div>
  </div>`;
  throw new Error("Business not found");
}

function renderHeader() {
  els.name.textContent = biz.name;
  els.category.textContent = biz.category;

  const { avg, count } = getBizStats(biz.id);
  els.rating.textContent = formatRating(avg, count);

  els.desc.textContent = biz.description;
  els.address.textContent = biz.address;
  els.phone.textContent = biz.phone;
  els.hours.textContent = biz.hours;

  // update favorite button style based on current state
  const fav = isFavorited(biz.id);
  els.favBtn.className = `btn ${fav ? "btn-dark" : "btn-outline-dark"}`;
  els.favBtn.textContent = fav ? "⭐ Favorited" : "⭐ Favorite";
}

// only show the deal card if the deal hasn't expired
function renderDeal() {
  const active = isDealActive(biz.deal);
  if (!active) {
    els.dealCard.classList.add("d-none");
    return;
  }
  els.dealTitle.textContent = biz.deal.title;
  els.dealCode.textContent = biz.deal.code;
  els.dealExpiry.textContent = biz.deal.expires;
  els.dealCard.classList.remove("d-none");
}

function renderReviews() {
  const reviewsMap = getReviewsMap();
  const reviews = reviewsMap[biz.id] || [];

  els.reviewsList.innerHTML = "";

  if (reviews.length === 0) {
    els.noReviews.classList.remove("d-none");
    return;
  }
  els.noReviews.classList.add("d-none");

  // show newest reviews first
  const sorted = [...reviews].sort((a, b) => b.ts - a.ts);

  for (const r of sorted) {
    const dt = new Date(r.ts);
    const item = document.createElement("div");
    item.className = "p-3 border rounded";
    item.innerHTML = `
      <div class="d-flex justify-content-between align-items-center">
        <div class="d-flex align-items-center gap-2">
          <div class="fw-semibold">⭐ ${escapeHtml(r.rating)} / 5</div>
          <div class="text-secondary small">— ${escapeHtml(r.name || "Anonymous")}</div>
        </div>
        <div class="text-secondary small">${escapeHtml(dt.toLocaleString())}</div>
      </div>
      <div class="mt-2">${escapeHtml(r.comment)}</div>
    `;
    els.reviewsList.appendChild(item);
  }
}

// simple math captcha to stop bots from spamming reviews
let captcha = { a: 0, b: 0, answer: 0 };

function newCaptcha() {
  const a = Math.floor(Math.random() * 10) + 1;
  const b = Math.floor(Math.random() * 10) + 1;
  captcha = { a, b, answer: a + b };
  els.captchaQuestion.textContent = `What is ${a} + ${b}?`;
  els.captchaInput.value = "";
}

function showFormMsg(type, text) {
  els.formMsg.className = `alert alert-${type}`;
  els.formMsg.textContent = text;
  els.formMsg.classList.remove("d-none");
}

function clearFormMsg() {
  els.formMsg.classList.add("d-none");
}

function submitReview() {
  clearFormMsg();

  const ratingStr = els.ratingInput.value;
  const comment = els.commentInput.value.trim();
  const captchaStr = els.captchaInput.value.trim();
  const rating = Number(ratingStr);

  if (!ratingStr || Number.isNaN(rating) || rating < 1 || rating > 5) {
    showFormMsg("warning", "Please select a rating from 1 to 5.");
    return;
  }
  if (comment.length < 5) {
    showFormMsg("warning", "Please write a comment (at least 5 characters).");
    return;
  }
  if (captchaStr === "" || Number(captchaStr) !== captcha.answer) {
    showFormMsg("danger", "Verification failed. Please answer the math question correctly.");
    newCaptcha();
    return;
  }

  // attach the reviewer's name from their session if logged in
  const session = getSession();
  const reviewerName = session ? session.name : "Anonymous";

  const reviewsMap = getReviewsMap();
  const list = reviewsMap[biz.id] || [];
  list.push({ rating, comment, ts: Date.now(), name: reviewerName });
  reviewsMap[biz.id] = list;
  setReviewsMap(reviewsMap);

  // reset the form after a successful submission
  els.ratingInput.value = "";
  els.commentInput.value = "";
  newCaptcha();

  renderHeader();
  renderReviews();
  showFormMsg("success", "Review submitted successfully!");
}

els.favBtn.addEventListener("click", () => {
  toggleFavorite(biz.id);
  renderHeader();
});

els.newCaptchaBtn.addEventListener("click", (e) => {
  e.preventDefault();
  newCaptcha();
});

els.submitBtn.addEventListener("click", (e) => {
  e.preventDefault();
  submitReview();
});

renderHeader();
renderDeal();
renderReviews();
newCaptcha();