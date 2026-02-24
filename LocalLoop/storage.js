// handles everything localStorage related
// all keys are versioned so we don't clash with other projects on the same browser

const LS_KEYS = {
  businesses: "locallift_businesses_v1",
  reviews: "locallift_reviews_v1",
  favorites: "locallift_favorites_v1",
  users: "locallift_users_v1",
  session: "locallift_session_v1"
};

// safe wrapper — if JSON is corrupted for some reason, just return the fallback
function lsGet(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function lsSet(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// runs once on first visit to seed default data
function initData() {
  const existing = lsGet(LS_KEYS.businesses, null);
  if (!existing) lsSet(LS_KEYS.businesses, DEFAULT_BUSINESSES);

  const reviews = lsGet(LS_KEYS.reviews, null);
  if (!reviews) lsSet(LS_KEYS.reviews, {}); // keyed by business id

  const favs = lsGet(LS_KEYS.favorites, null);
  if (!favs) lsSet(LS_KEYS.favorites, []);

  const users = lsGet(LS_KEYS.users, null);
  if (!users) lsSet(LS_KEYS.users, []);
}

function getBusinesses() {
  return lsGet(LS_KEYS.businesses, DEFAULT_BUSINESSES);
}

function getReviewsMap() {
  return lsGet(LS_KEYS.reviews, {});
}

function setReviewsMap(map) {
  lsSet(LS_KEYS.reviews, map);
}

function getFavorites() {
  return lsGet(LS_KEYS.favorites, []);
}

function setFavorites(favs) {
  lsSet(LS_KEYS.favorites, favs);
}

// user account functions

function getUsers() {
  return lsGet(LS_KEYS.users, []);
}

function registerUser(name, email, password) {
  const users = getUsers();

  // make sure no duplicate emails
  const exists = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (exists) return { ok: false, error: "An account with that email already exists." };

  const user = { id: "u_" + Date.now(), name, email: email.toLowerCase(), password };
  users.push(user);
  lsSet(LS_KEYS.users, users);
  setSession(user);
  return { ok: true, user };
}

function loginUser(email, password) {
  const users = getUsers();
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
  if (!user) return { ok: false, error: "Incorrect email or password." };
  setSession(user);
  return { ok: true, user };
}

// session is just the user's basic info — no password stored here
function setSession(user) {
  lsSet(LS_KEYS.session, { id: user.id, name: user.name, email: user.email });
}

function getSession() {
  return lsGet(LS_KEYS.session, null);
}

function clearSession() {
  localStorage.removeItem(LS_KEYS.session);
}