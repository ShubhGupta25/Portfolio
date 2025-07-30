// main.js
// All previously inline scripts have been moved here.
// Order note: emailjs is loaded via a separate <script> tag with defer BEFORE this file.

// 1) EmailJS contact form handling
(function () {
  // 1) Init with your public key
  emailjs.init("ba_tX09M9-yxsoWnK");

  const form = document.getElementById("contactFormEmailJS");
  const submit = document.getElementById("contactSubmitEmailJS");
  const status = document.getElementById("contactStatusEmailJS");

  if (!form || !submit || !status) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    status.textContent = "";
    submit.disabled = true;
    submit.textContent = "Sending…";

    try {
      // Read fields
      const formData = new FormData(form);

      const name = (
        formData.get("from_name") ||
        formData.get("name") ||
        "Website Visitor"
      ).trim();
      const email = (
        formData.get("reply_to") ||
        formData.get("email") ||
        ""
      ).trim();
      const title = (
        formData.get("subject") ||
        document.title ||
        "Portfolio"
      ).trim();
      const rawMsg = (formData.get("message") || "").trim();

      // Timestamp in IST (Asia/Kolkata)
      const whenIST = new Date().toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

      // Compose a neat, readable body
      const composedMessage = [
        "📩 New portfolio inquiry",
        "────────────────────────",
        `Name: ${name}`,
        `Email: ${email || "—"}`,
        `Time (IST): ${whenIST}`,
        "",
        "Message:",
        rawMsg || "(no message provided)",
      ].join("\n");

      // Subject line
      const subject = `Portfolio Inquiry • ${title} • ${whenIST}`;

      // Final EmailJS params (use these variables in your EmailJS template)
      const params = {
        from_name: name,
        reply_to: email,
        subject, // add {{subject}} in your template if desired
        message: composedMessage, // add {{message}} in your template body
        to_email: "shubhgupta036@gmail.com",
      };

      // 2) Use your EmailJS service & template IDs
      await emailjs.send("service_bezinql", "template_0in6erd", params);

      form.reset();
      status.style.color = "#9be09b";
      status.textContent = "Thanks! Your message was sent successfully.";
    } catch (err) {
      console.error(err);
      status.style.color = "#f88";
      status.textContent =
        "Could not send the message. Please try again later.";
      alert("Send failed: " + (err?.text || err?.message || err));
    } finally {
      submit.disabled = false;
      submit.textContent = "Send Message";
    }
  });
})();

// 2) Load GitHub repos into Projects grid
(async function loadRepos() {
  const grid = document.getElementById("projects-grid");
  const status = document.getElementById("projects-status");

  if (!grid || !status) return;

  const username = "ShubhGupta25";
  const baseUrl = `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`;

  // Toggle filters here
  const EXCLUDE_FORKS = true;
  const EXCLUDE_ARCHIVED = true;

  // Helpers
  const ogImage = (fullName) =>
    `https://opengraph.githubassets.com/1/${fullName}`;
  const fallbackImg = (seed) =>
    `https://picsum.photos/seed/${encodeURIComponent(
      seed || "project"
    )}/1200/600`;
  const fmtDate = (iso) => {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "2-digit",
      });
    } catch {
      return iso || "";
    }
  };

  async function fetchAll(url) {
    const all = [];
    let next = url;

    while (next) {
      const res = await fetch(next, {
        headers: {
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
          // "Authorization": "Bearer YOUR_TOKEN_HERE", // ← Optional: add if you hit rate limits
          "User-Agent": username,
        },
      });

      if (!res.ok) {
        const msg = `GitHub API error: ${res.status} ${res.statusText}`;
        throw new Error(msg);
      }

      const page = await res.json();
      all.push(...page);

      // Parse Link header for pagination
      const link = res.headers.get("Link");
      if (link && link.includes('rel="next"')) {
        const m = link.split(",").find((p) => p.includes('rel="next"'));
        next = m ? m.split(";")[0].trim().slice(1, -1) : null;
      } else {
        next = null;
      }

      // Show rate limit warning if close to limit (unauthenticated limit is 60/hour)
      const remain = res.headers.get("X-RateLimit-Remaining");
      if (remain !== null && Number(remain) <= 2) {
        console.warn("GitHub rate limit low. Consider adding a token.");
      }
    }
    return all;
  }

  try {
    status.textContent = "Loading projects…";
    const repos = await fetchAll(baseUrl);

    // Filter and sort
    let filtered = repos
      .filter((r) => !EXCLUDE_ARCHIVED || !r.archived)
      .filter((r) => !EXCLUDE_FORKS || !r.fork);

    filtered.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

    // Build HTML
    const html = filtered
      .map((r) => {
        const title = r.name || r.full_name;
        const desc =
          r.description && r.description.trim()
            ? r.description
            : "No description provided.";
        const img = ogImage(r.full_name);
        const repoUrl = r.html_url;
        const live = r.homepage && r.homepage.trim() ? r.homepage : "";
        const lang = r.language || "—";
        const stars = r.stargazers_count || 0;
        const updated = r.updated_at ? fmtDate(r.updated_at) : "";

        return `
          <div class="card">
            <a href="${repoUrl}" target="_blank" rel="noopener">
              <img src="${img}" alt="${title}" onerror="this.src='${fallbackImg(
          title
        )}'">
            </a>
            <div class="card-content">
              <h4>${title}</h4>
              <p>${desc}</p>

              <div style="margin-top:12px; display:flex; gap:12px; flex-wrap:wrap; align-items:center;">
                <span class="skill" style="cursor:default;">${lang}</span>
                <span style="color:#bbb; font-size:.95rem;">★ ${stars}</span>
                ${
                  updated
                    ? `<span style="color:#888; font-size:.9rem;">Updated: ${updated}</span>`
                    : ``
                }
              </div>

              <div style="margin-top:16px; display:flex; gap:12px; flex-wrap:wrap;">
                <a href="${repoUrl}" target="_blank" rel="noopener" style="text-decoration:none;">
                  <span style="display:inline-block;padding:10px 16px;border-radius:24px;background:var(--gradient);font-weight:700;font-size:.95rem;">Repo</span>
                </a>
                ${
                  live
                    ? `
                <a href="${live}" target="_blank" rel="noopener" style="text-decoration:none;">
                  <span style="display:inline-block;padding:10px 16px;border-radius:24px;background:var(--gradient);font-weight:700;font-size:.95rem;">Live</span>
                </a>`
                    : ``
                }
              </div>
            </div>
          </div>
        `;
      })
      .join("");

    grid.innerHTML =
      html || `<p style="color:#bbb;">No projects to show yet.</p>`;
    status.textContent = ""; // clear loader
  } catch (err) {
    console.error(err);
    status.innerHTML = `
        <div style="color:#f88;">
          Couldn’t load projects from GitHub. ${err.message || ""}<br/>
          You can try again later, or add a GitHub token in the script headers to avoid rate limits.
        </div>`;
  }
})();

// 3) Accessible burger nav toggle
(function () {
  const body = document.body;
  const btn = document.querySelector(".nav-toggle");
  const nav = document.getElementById("primary-nav");

  if (!btn || !nav) return;

  function setOpen(open) {
    btn.setAttribute("aria-expanded", String(open));
    body.classList.toggle("nav-open", open);
    if (open) {
      // focus first link for keyboard users
      const first = nav.querySelector(
        'a, button, [tabindex]:not([tabindex="-1"])'
      );
      if (first) first.focus({ preventScroll: true });
    } else {
      // return focus to button
      btn.focus({ preventScroll: true });
    }
  }

  btn.addEventListener("click", () => {
    const isOpen = body.classList.contains("nav-open");
    setOpen(!isOpen);
  });

  // Close on Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && body.classList.contains("nav-open")) {
      setOpen(false);
    }
  });

  // Close when clicking outside
  document.addEventListener("click", (e) => {
    if (!body.classList.contains("nav-open")) return;
    const within =
      e.target === nav ||
      nav.contains(e.target) ||
      e.target === btn ||
      btn.contains(e.target);
    if (!within) setOpen(false);
  });

  // Optional: close when a nav link is clicked
  nav.addEventListener("click", (e) => {
    const t = e.target.closest("a");
    if (t) setOpen(false);
  });
})();

// 4) Typewriter animation
(function () {
  const el = document.getElementById("typewriter");
  if (!el) return;

  // The phrases you want to cycle
  const PHRASES = [
    "Hi, I'm Shubh Gupta",
    "Java & Spring Boot Developer",
    "I build scalable event‑driven microservices",
    "Kafka • Spring WebFlux • AWS • DDD",
    "Thanks for visiting my portfolio",
  ];

  // Speeds
  const TYPE_BASE = 130; // ms per char
  const TYPE_VAR = 35; // +/- jitter
  const DELETE_BASE = 70;
  const DELETE_VAR = 20;

  const HOLD_AFTER_TYPE = 1200; // pause after completing a line
  const HOLD_AFTER_DELETE = 300; // tiny pause before next type

  // Respect reduced motion: just show final message
  const reduceMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) {
    el.textContent = PHRASES[1];
    return;
  }

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const jitter = (base, varr) =>
    Math.max(10, base + (Math.random() * 2 - 1) * varr);

  async function type(text) {
    el.textContent = "";
    for (let i = 0; i < text.length; i++) {
      el.textContent = text.slice(0, i + 1); // caret span follows after this, so it’s always at end
      await sleep(jitter(TYPE_BASE, TYPE_VAR));
    }
  }

  async function del(text) {
    for (let i = text.length; i > 0; i--) {
      el.textContent = text.slice(0, i - 1);
      await sleep(jitter(DELETE_BASE, DELETE_VAR));
    }
    el.textContent = "";
  }

  (async function loop() {
    let idx = 0;
    while (true) {
      const phrase = PHRASES[idx % PHRASES.length];
      // type
      await type(phrase);
      await sleep(HOLD_AFTER_TYPE);
      // delete
      await del(phrase);
      await sleep(HOLD_AFTER_DELETE);
      idx++;
    }
  })();
})();
