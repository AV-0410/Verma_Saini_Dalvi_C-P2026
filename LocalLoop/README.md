# LocalLoop — FBLA Coding & Programming

LocalLoop is a web app we built to help people discover and support small businesses in their local community. Users can browse listings, leave reviews, save favourites, and grab deals/coupons, all without needing a backend server.

## What it does
- Browse local businesses across 4 categories: Food, Retail, Services, Health/Fitness
- Search by name or keywords, and sort by rating or review count
- Create an account and log in (with Google reCAPTCHA verification)
- Leave star ratings and written reviews, your name shows up automatically
- Save businesses to a favourites list, organized by category
- Active deals and coupon codes are shown on listings; expired ones are hidden automatically

## Running the project
1. Download or clone the folder
2. Open `index.html` with VS Code's Live Server (or any local server)
3. It should work in any modern browser — we tested mainly in Chrome

> Note: reCAPTCHA won't work if you open the HTML file directly (file:///...). You need a local server like Live Server for it to load properly.

## How data is stored
Everything is saved to localStorage — reviews, favourites, and user accounts all persist between sessions on the same device. No backend needed.

## Files
- `index.html` / `index.js` — browse page with search, filter, and sort
- `business.html` / `business.js` — individual business page with reviews and deals
- `favorites.html` / `favorites.js` — saved businesses grouped by category
- `about.html` — team info and project description
- `auth.js` — login/signup modal with reCAPTCHA (Google API)
- `data.js` — all the business listings
- `storage.js` — localStorage read/write helpers
- `common.js` — shared functions used across pages
- `styles.css` — all styling (uses DM Sans + Fraunces from Google Fonts)
