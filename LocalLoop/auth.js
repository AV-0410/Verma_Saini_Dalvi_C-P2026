// auth.js — must load AFTER data.js and storage.js

(function () {

  const RECAPTCHA_SITE_KEY = "6LcSw3UsAAAAAHf9riO6FXVuhLPvJ0cSacdIlyfy";

  // ── helpers ────────────────────────────────────────────────
  function escapeStr(str) {
    return String(str)
      .replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
  }

  function renderNavUser(user) {
    const navBtns = document.querySelector(".navbar .d-flex");
    if (!navBtns) return;
    const greeting = document.createElement("span");
    greeting.style.cssText = "color:rgba(255,255,255,0.75);font-size:0.88rem;font-family:'DM Sans',sans-serif;display:flex;align-items:center;gap:10px;";
    greeting.innerHTML = `
      Hi, <strong style="color:#fff;">${escapeStr(user.name.split(" ")[0])}</strong>
      <button id="logoutBtn" style="
        background:transparent;border:1.5px solid rgba(255,255,255,0.35);
        color:rgba(255,255,255,0.75);border-radius:6px;padding:3px 10px;
        font-size:0.8rem;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all 0.15s;
      ">Log out</button>
    `;
    navBtns.prepend(greeting);
    document.getElementById("logoutBtn").addEventListener("click", () => {
      clearSession();
      window.location.reload();
    });
  }

  // ── if already logged in, skip modal ───────────────────────
  const session = getSession();
  if (session) {
    renderNavUser(session);
    return;
  }

  // ── load reCAPTCHA script ──────────────────────────────────
  // declare the callback BEFORE appending the script so it's available when the API loads
  window.onRecaptchaLoad = function () {
    loginWidgetId = grecaptcha.render("recaptchaLogin", { sitekey: RECAPTCHA_SITE_KEY });
  };

  const rcScript = document.createElement("script");
  rcScript.src = `https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit`;
  rcScript.async = true;
  rcScript.defer = true;
  document.head.appendChild(rcScript);

  // ── inject styles ──────────────────────────────────────────
  const style = document.createElement("style");
  style.textContent = `
    @keyframes authSlideIn {
      from { opacity:0; transform:translateY(20px) scale(0.97); }
      to   { opacity:1; transform:translateY(0) scale(1); }
    }
    #authCard { animation: authSlideIn 0.32s cubic-bezier(.22,1,.36,1); }
    .auth-tab {
      flex:1; padding:15px; border:none; background:transparent;
      font-family:'DM Sans',sans-serif; font-weight:600; font-size:0.95rem;
      cursor:pointer; border-bottom:2.5px solid transparent;
      color:#94A3B8; transition:color 0.15s, border-color 0.15s;
    }
    .auth-tab.active { color:#0F172A; border-bottom-color:#FF6B6B; }
    .auth-input {
      width:100%; padding:10px 14px; border:1.5px solid #E2E8F0;
      border-radius:8px; font-size:0.9rem; font-family:'DM Sans',sans-serif;
      outline:none; transition:border-color 0.15s, box-shadow 0.15s;
      box-sizing:border-box; color:#0F172A;
    }
    .auth-input:focus { border-color:#FF6B6B; box-shadow:0 0 0 3px rgba(255,107,107,0.15); }
    .auth-btn {
      width:100%; padding:12px; background:#FF6B6B; color:#fff;
      border:none; border-radius:8px; font-size:0.95rem; font-weight:600;
      font-family:'DM Sans',sans-serif; cursor:pointer;
      box-shadow:0 2px 8px rgba(255,107,107,0.35);
      transition:background 0.15s, transform 0.1s, box-shadow 0.15s;
    }
    .auth-btn:hover { background:#e85555; transform:translateY(-1px); box-shadow:0 4px 14px rgba(255,107,107,0.4); }
    .auth-btn:active { transform:translateY(0); }
    .auth-link { color:#FF6B6B; font-weight:600; cursor:pointer; text-decoration:none; }
    .auth-link:hover { text-decoration:underline; }
    #authError {
      display:none;
      background:#FFE5E5;
      border-left:4px solid #FF6B6B;
      color:#991B1B;
      border-radius:8px;
      padding:11px 14px;
      font-size:0.88rem;
      margin-bottom:16px;
      font-family:'DM Sans',sans-serif;
      font-weight:500;
      line-height:1.4;
    }
    .recaptcha-wrap {
      display:flex;
      justify-content:center;
      margin-bottom:18px;
      margin-top:2px;
    }
    /* shrink reCAPTCHA slightly so it fits card nicely */
    .recaptcha-wrap > div {
      transform: scale(0.95);
      transform-origin: center;
    }
  `;
  document.head.appendChild(style);

  // ── build modal ────────────────────────────────────────────
  const overlay = document.createElement("div");
  overlay.id = "authOverlay";
  overlay.style.cssText = `
    position:fixed; inset:0; z-index:9999;
    background:rgba(15,23,42,0.75);
    backdrop-filter:blur(6px);
    display:flex; align-items:center; justify-content:center;
    padding:16px;
  `;

  overlay.innerHTML = `
    <div id="authCard" style="background:#fff;border-radius:20px;width:100%;max-width:420px;box-shadow:0 32px 80px rgba(15,23,42,0.3);overflow:hidden;">

      <div style="display:flex;background:#F8FAFC;border-bottom:1px solid #E2E8F0;">
        <button class="auth-tab active" data-tab="login">Log In</button>
        <button class="auth-tab" data-tab="signup">Sign Up</button>
      </div>

      <div style="padding:28px;">
        <div style="text-align:center;margin-bottom:22px;">
          <div style="font-family:'Fraunces',serif;font-size:1.65rem;font-weight:700;color:#0F172A;letter-spacing:-0.03em;">LocalLoop</div>
          <div id="authSubtitle" style="color:#94A3B8;font-size:0.88rem;margin-top:5px;font-family:'DM Sans',sans-serif;">Welcome back! Log in to continue.</div>
        </div>

        <div id="authError"></div>

        <!-- LOGIN FORM -->
        <div id="formLogin">
          <div style="margin-bottom:14px;">
            <label style="display:block;font-size:0.83rem;font-weight:600;margin-bottom:6px;color:#0F172A;font-family:'DM Sans',sans-serif;">Email</label>
            <input id="loginEmail" class="auth-input" type="email" placeholder="you@email.com" autocomplete="email" />
          </div>
          <div style="margin-bottom:18px;">
            <label style="display:block;font-size:0.83rem;font-weight:600;margin-bottom:6px;color:#0F172A;font-family:'DM Sans',sans-serif;">Password</label>
            <input id="loginPassword" class="auth-input" type="password" placeholder="••••••••" autocomplete="current-password" />
          </div>
          <div class="recaptcha-wrap">
            <div class="g-recaptcha" id="recaptchaLogin" data-sitekey="${RECAPTCHA_SITE_KEY}"></div>
          </div>
          <button id="loginBtn" class="auth-btn">Log In</button>
          <p style="text-align:center;margin-top:16px;font-size:0.85rem;color:#94A3B8;font-family:'DM Sans',sans-serif;margin-bottom:0;">
            Don't have an account? <a class="auth-link" data-tab="signup">Sign up</a>
          </p>
        </div>

        <!-- SIGNUP FORM -->
        <div id="formSignup" style="display:none;">
          <div style="margin-bottom:14px;">
            <label style="display:block;font-size:0.83rem;font-weight:600;margin-bottom:6px;color:#0F172A;font-family:'DM Sans',sans-serif;">Full Name</label>
            <input id="signupName" class="auth-input" type="text" placeholder="Your name" autocomplete="name" />
          </div>
          <div style="margin-bottom:14px;">
            <label style="display:block;font-size:0.83rem;font-weight:600;margin-bottom:6px;color:#0F172A;font-family:'DM Sans',sans-serif;">Email</label>
            <input id="signupEmail" class="auth-input" type="email" placeholder="you@email.com" autocomplete="email" />
          </div>
          <div style="margin-bottom:18px;">
            <label style="display:block;font-size:0.83rem;font-weight:600;margin-bottom:6px;color:#0F172A;font-family:'DM Sans',sans-serif;">Password</label>
            <input id="signupPassword" class="auth-input" type="password" placeholder="Min. 6 characters" autocomplete="new-password" />
          </div>
          <div class="recaptcha-wrap">
            <div class="g-recaptcha" id="recaptchaSignup" data-sitekey="${RECAPTCHA_SITE_KEY}"></div>
          </div>
          <button id="signupBtn" class="auth-btn">Create Account</button>
          <p style="text-align:center;margin-top:16px;font-size:0.85rem;color:#94A3B8;font-family:'DM Sans',sans-serif;margin-bottom:0;">
            Already have an account? <a class="auth-link" data-tab="login">Log in</a>
          </p>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  // ── tab switching ──────────────────────────────────────────
  overlay.addEventListener("click", function (e) {
    const target = e.target.closest("[data-tab]");
    if (!target) return;
    e.preventDefault();
    showTab(target.dataset.tab);
  });

  function showTab(tab) {
    const isLogin = tab === "login";
    document.getElementById("formLogin").style.display = isLogin ? "block" : "none";
    document.getElementById("formSignup").style.display = isLogin ? "none" : "block";
    document.getElementById("authSubtitle").textContent = isLogin
      ? "Welcome back! Log in to continue."
      : "Join LocalLoop — it's free.";
    overlay.querySelectorAll(".auth-tab").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.tab === tab);
    });
    clearError();

    if (window.grecaptcha) {
      try {
        if (isLogin) {
          if (loginWidgetId !== null) grecaptcha.reset(loginWidgetId);
        } else {
          // signup form is now visible — render the widget the first time, reset after that
          if (!signupWidgetRendered) {
            signupWidgetId = grecaptcha.render("recaptchaSignup", { sitekey: RECAPTCHA_SITE_KEY });
            signupWidgetRendered = true;
          } else {
            grecaptcha.reset(signupWidgetId);
          }
        }
      } catch (e) { }
    }
  }

  // ── error helpers ──────────────────────────────────────────
  function showError(msg) {
    const el = document.getElementById("authError");
    el.innerHTML = `<span style="margin-right:6px;">⚠️</span>${escapeStr(msg)}`;
    el.style.display = "block";
  }

  function clearError() {
    const el = document.getElementById("authError");
    el.style.display = "none";
    el.textContent = "";
  }

  overlay.querySelectorAll(".auth-input").forEach(inp => {
    inp.addEventListener("input", clearError);
  });

  // render reCAPTCHA widgets explicitly after API loads
  // signup form starts hidden so we can only safely render login right away —
  // the signup widget gets rendered the first time the user opens that tab
  let loginWidgetId = null;
  let signupWidgetId = null;
  let signupWidgetRendered = false;



  // ── login submit ───────────────────────────────────────────
  document.getElementById("loginBtn").addEventListener("click", () => {
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    if (!email && !password) { showError("Please enter your email and password."); return; }
    if (!email) { showError("Please enter your email address."); return; }
    if (!password) { showError("Please enter your password."); return; }

    // check reCAPTCHA
    const token = window.grecaptcha
      ? (loginWidgetId !== null ? grecaptcha.getResponse(loginWidgetId) : grecaptcha.getResponse())
      : "";
    if (!token) { showError("Please complete the human verification before continuing."); return; }

    const result = loginUser(email, password);
    if (!result.ok) {
      showError(result.error);
      grecaptcha.reset(loginWidgetId);
      return;
    }
    dismissModal(result.user);
  });

  // ── signup submit ──────────────────────────────────────────
  document.getElementById("signupBtn").addEventListener("click", () => {
    const name = document.getElementById("signupName").value.trim();
    const email = document.getElementById("signupEmail").value.trim();
    const password = document.getElementById("signupPassword").value;

    if (!name) { showError("Please enter your full name."); return; }
    if (!email) { showError("Please enter your email address."); return; }
    if (!password) { showError("Please create a password."); return; }
    if (password.length < 6) { showError("Password must be at least 6 characters long."); return; }

    // check reCAPTCHA — use signupWidgetId if rendered, otherwise fall back to getResponse()
    const token = window.grecaptcha
      ? (signupWidgetId !== null ? grecaptcha.getResponse(signupWidgetId) : grecaptcha.getResponse())
      : "";
    if (!token) { showError("Please complete the human verification before continuing."); return; }

    const result = registerUser(name, email, password);
    if (!result.ok) {
      showError(result.error);
      if (signupWidgetId !== null) grecaptcha.reset(signupWidgetId);
      return;
    }
    dismissModal(result.user);
  });

  // Enter key support
  document.getElementById("loginPassword").addEventListener("keydown", e => { if (e.key === "Enter") document.getElementById("loginBtn").click(); });
  document.getElementById("signupPassword").addEventListener("keydown", e => { if (e.key === "Enter") document.getElementById("signupBtn").click(); });

  // ── dismiss ────────────────────────────────────────────────
  function dismissModal(user) {
    overlay.style.transition = "opacity 0.25s ease";
    overlay.style.opacity = "0";
    setTimeout(() => overlay.remove(), 260);
    renderNavUser(user);
  }

})();