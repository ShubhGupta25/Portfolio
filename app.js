/* app.js (updated)
   - Uses siteData from localStorage if available; falls back to DEFAULT_SITE_DATA.
   - Builds the entire portfolio DOM and wires up interactions.
*/

// ------------------ DEFAULT DATA ------------------ //
const DEFAULT_SITE_DATA = {
  meta: {
    name: "Shubh Gupta",
    tagline: "Java Developer | Microservices | Spring Boot | Cloud Enthusiast",
  },
  // inside DEFAULT_SITE_DATA (or your initial siteData)
  nav: [
    { href: "#home", label: "Home", current: true },
    { href: "#about", label: "About" },
    { href: "#portfolio", label: "Experience" },
    { href: "#projects-section", label: "Projects" },
    { href: "#skills", label: "Skills" },
    { href: "#education", label: "Education" },
    { href: "#achievements", label: "Achievements" },
    { href: "#certificates", label: "Certificates" },
    { href: "#recommendations", label: "Recommendations" },
    { href: "#contact", label: "Contact" },
  ],
  hero: {
    phrases: [
      "Hi, I'm Shubh Gupta",
      "Java & Spring Boot Developer",
      "I build scalable event‑driven microservices",
      "Kafka • Spring WebFlux • AWS • DDD",
      "Thanks for visiting my portfolio",
    ],
    socials: [
      {
        href: "https://www.linkedin.com/in/shubh-guptaa/",
        img: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linkedin/linkedin-original.svg",
        alt: "LinkedIn",
      },
      {
        href: "https://github.com/ShubhGupta25/",
        img: "https://cdn.simpleicons.org/github/ffffff",
        alt: "GitHub",
      },
      {
        href: "https://leetcode.com/ShubhGupta25/",
        img: "https://cdn.simpleicons.org/leetcode/ffffff",
        alt: "LeetCode",
      },
    ],
  },
  about: {
    avatar: "https://avatars.githubusercontent.com/u/86280855?v=4",
    text: `Java developer with 2 years of experience in event-driven
microservices and legacy modernization using Java and Spring Boot.
Strong in collaboration, optimization, and adapting to new tech.
<br /><br />
<b>Location:</b> Bengaluru, Karnataka<br />
<b>Email:</b> shubhgupta036@gmail.com<br />
<b>Phone:</b> +91 9752897467`,
  },
  experience: [
    {
      logo: "https://cdn.simpleicons.org/infosys/0a74ff",
      role: "Specialist Programmer, Infosys",
      desc: `<b>02/2024 – Present | Bangalore, Karnataka</b><br />
Engineer III (Contractor) at American Express.<br />
• Migrated legacy mainframe systems to Java microservices using Spring Boot.<br />
• Built a configurable, global codebase supporting multiple markets.<br />
• Developed a rule engine with ANTLR for dynamic business logic.<br />
• Implemented Kafka-based batch and real-time pipeline for data delivery.<br />
• Automated binary data transformation for seamless integration.<br />
• Configured a variety of products for different markets.<br />
<i>Tech: DDD, Event-driven Architecture, Reactive Programming, TDD, BDD</i>`,
    },
    {
      logo: "https://cdn.simpleicons.org/cognizant/00c7fd",
      role: "Programmer Analyst, Cognizant",
      desc: `<b>01/2023 – 01/2024 | Chennai, Tamil Nadu</b><br />
Internship & Full-Time (offer delayed due to restructuring).<br />
• Built RESTful APIs using Spring Boot with AWS Lambda and API Gateway.<br />
• Contributed to POCs using AWS services like S3, DynamoDB, and CloudWatch.`,
    },
  ],
  skills: [
    "Java SE",
    "Spring Boot",
    "Spring WebFlux",
    "REST & GraphQL APIs",
    "Microservices",
    "C++",
    "TypeScript",
    "SQL",
    "Cassandra",
    "MySQL",
    "MongoDB",
    "PostgreSQL",
    "Kafka",
    "AWS",
    "Jenkins",
    "GitHub Actions",
    "Docker",
    "Kubernetes",
    "OOP",
    "TDD/BDD",
    "JUnit",
    "Cucumber",
    "Problem Solving",
  ],
  achievements: [
    "Secured 2nd place in the Infosys Hackathon by developing a talent acquisition solution.",
    "Achieved a LeetCode rating of 1872 and earned the Knight Badge (top 5% of all users).",
  ],
  education: {
    logo: "https://lnct.ac.in/wp-content/uploads/2021/04/LNCT-Logo.png",
    headline: "Lakshmi Narain College Of Technology",
    details: "Bachelor Of Technology | Computer Science Engineering",
    meta: "05/2023 | Bhopal, Madhya Pradesh",
  },
  certificates: [
    {
      img: "https://cdn.simpleicons.org/coursera/2A73CC",
      title: "Microservices with Spring Boot",
      issuer: "Coursera • Specialization",
      meta: "Issued: Feb 2024 • Credential ID: ABCD-1234",
      tags: ["Spring Boot", "Microservices", "Kafka"],
      verify:
        "https://www.coursera.org/account/accomplishments/verify/ABCD1234",
    },
    {
      img: "https://cdn.simpleicons.org/udemy/A435F0",
      title: "Advanced Java Programming",
      issuer: "Udemy",
      meta: "Issued: Nov 2023 • Credential ID: UDE-5678",
      tags: ["Java", "Design Patterns", "JUnit"],
      verify: "https://www.udemy.com/certificate/UC-XXXXXX/",
    },
    {
      img: "https://cdn.simpleicons.org/amazonaws/FF9900",
      title: "AWS Cloud Practitioner",
      issuer: "Amazon Web Services",
      meta: "Issued: Aug 2023 • Credential ID: AWS-CLF-9999",
      tags: ["AWS", "Cloud", "Security"],
      verify: "https://www.credly.com/badges/",
    },
  ],
  recommendations: [
    {
      avatar: "https://i.pravatar.cc/120?img=14",
      name: "Priya Sharma",
      title: "Engineering Manager • American Express",
      text: "Shubh ramped up quickly on a complex legacy modernization project and consistently delivered high‑quality, well‑tested microservices. His ownership and calm under pressure made him the go‑to engineer for critical paths.",
      tags: ["Ownership", "Spring Boot", "Kafka"],
    },
  ],
  projects: {
    username: "ShubhGupta25",
    excludeForks: true,
    excludeArchived: true,
  },
  contact: {
    emailTo: "shubhgupta036@gmail.com",
    emailJs: {
      publicKey: "ba_tX09M9-yxsoWnK",
      serviceId: "service_bezinql",
      templateId: "template_0in6erd",
    },
  },
};

// Prefer persisted siteData from localStorage
let siteData;
try {
  const saved = localStorage.getItem("siteData");
  siteData = saved ? JSON.parse(saved) : DEFAULT_SITE_DATA;
} catch {
  siteData = DEFAULT_SITE_DATA;
}

// Expose for debugging if needed
window.__siteData = siteData;

// ------------------ HELPERS & RENDERERS ------------------ //
const h = (tag, attrs = {}, children = []) => {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === "class") el.className = v;
    else if (k === "style") el.setAttribute("style", v);
    else if (k.startsWith("on") && typeof v === "function")
      el.addEventListener(k.slice(2), v);
    else if (v !== null && v !== undefined) el.setAttribute(k, v);
  }
  const append = (c) => {
    if (c === null || c === undefined) return;
    if (typeof c === "string") el.insertAdjacentHTML("beforeend", c);
    else if (c instanceof Node) el.appendChild(c);
    else if (Array.isArray(c)) c.forEach(append);
  };
  append(children);
  return el;
};

function renderHeader() {
  const navLinks = siteData.nav.map((n) =>
    h(
      "a",
      { href: n.href, ...(n.current ? { "aria-current": "page" } : {}) },
      n.label
    )
  );

  const header = h("header", { class: "hdr", role: "banner" }, [
    h("div", { class: "hdr__inner" }, [
      h("h1", { class: "brand" }, siteData.meta.name),
      h(
        "button",
        {
          class: "nav-toggle",
          "aria-expanded": "false",
          "aria-controls": "primary-nav",
          "aria-label": "Open menu",
        },
        [
          h("span", { class: "nav-toggle__bar", "aria-hidden": "true" }),
          h("span", { class: "nav-toggle__bar", "aria-hidden": "true" }),
          h("span", { class: "nav-toggle__bar", "aria-hidden": "true" }),
        ]
      ),
      h(
        "nav",
        { class: "nav", id: "primary-nav", "aria-label": "Primary" },
        navLinks
      ),
    ]),
  ]);
  return header;
}

function renderHero() {
  const socialEls = siteData.hero.socials.map((s) =>
    h("a", { href: s.href, target: "_blank", rel: "noopener" }, [
      h("img", { src: s.img, alt: s.alt }),
    ])
  );
  const hero = h(
    "section",
    { class: "hero sec", id: "home", "aria-labelledby": "hero-title" },
    [
      h("h2", { id: "hero-title" }, [
        h("span", { id: "typewriter", class: "tw" }, "Hi, I'm Shubh Gupta"),
        h("span", { class: "tw-caret", "aria-hidden": "true" }),
      ]),
      h("p", {}, siteData.meta.tagline),
      h("div", { class: "buttons" }, [
        h("a", { href: "#projects" }, "View Projects"),
        h("a", { href: "#contact" }, "Contact Me"),
      ]),
      h("div", { class: "socials", "aria-label": "Social links" }, socialEls),
    ]
  );
  return hero;
}

function renderAbout() {
  return h(
    "section",
    { class: "sec", id: "about", "aria-labelledby": "about-title" },
    [
      h("a", { id: "about", class: "anch", "aria-hidden": "true" }),
      h("h3", { class: "section-title", id: "about-title" }, "About"),
      h("div", { class: "section-divider", "aria-hidden": "true" }),
      h("div", { class: "about" }, [
        h("img", { src: siteData.about.avatar, alt: "Shubh Gupta avatar" }),
        h("div", { class: "about-card" }, [
          h("h3", {}, "About Me"),
          h("p", {}, siteData.about.text),
        ]),
      ]),
    ]
  );
}

function renderExperience() {
  const cards = siteData.experience.map((e) =>
    h("article", { class: "card" }, [
      h("img", { src: e.logo, alt: `${e.role.split(",")[0]} logo` }),
      h("div", { class: "card-content" }, [
        h("h4", {}, e.role),
        h("p", {}, e.desc),
      ]),
    ])
  );
  return h(
    "section",
    { class: "sec", id: "portfolio", "aria-labelledby": "exp-title" },
    [
      h("a", { id: "exp", class: "anch", "aria-hidden": "true" }),
      h("h3", { class: "section-title", id: "exp-title" }, "Experience"),
      h("div", { class: "section-divider", "aria-hidden": "true" }),
      h("div", { class: "portfolio-grid" }, cards),
    ]
  );
}

function renderProjects() {
  return h(
    "section",
    {
      class: "sec",
      id: "projects-section",
      "aria-labelledby": "projects-title",
    },
    [
      h("a", { id: "projects", class: "anch", "aria-hidden": "true" }),
      h("h3", { class: "section-title", id: "projects-title" }, "Projects"),
      h("div", { class: "section-divider", "aria-hidden": "true" }),
      h(
        "p",
        { id: "projects-status", class: "muted", style: "margin-top: 8px" },
        "Loading projects…"
      ),
      h(
        "div",
        { class: "carousel", "data-mode": "continuous", "data-speed": "0.55" },
        [
          h("div", {
            class: "carousel-track",
            id: "projects-track",
            role: "list",
            "aria-live": "polite",
          }),
          h(
            "button",
            {
              class: "carousel-btn prev",
              "aria-label": "Previous",
              title: "Previous (pauses on hover)",
            },
            "‹"
          ),
          h(
            "button",
            {
              class: "carousel-btn next",
              "aria-label": "Next",
              title: "Next (pauses on hover)",
            },
            "›"
          ),
          h("div", { class: "carousel-dots", id: "projects-dots" }),
          h("div", { class: "carousel-status", "aria-live": "polite" }),
        ]
      ),
    ]
  );
}

function renderSkills() {
  const items = siteData.skills.map((s) =>
    h("span", { class: "skill", role: "listitem" }, s)
  );
  return h(
    "section",
    { class: "sec", id: "skills", "aria-labelledby": "skills-title" },
    [
      h("h3", { class: "section-title", id: "skills-title" }, "Skills"),
      h("div", { class: "section-divider", "aria-hidden": "true" }),
      h("div", { class: "skills-list", role: "list" }, items),
    ]
  );
}

function renderAchievements() {
  const lis = siteData.achievements.map((a) => h("li", {}, a));
  return h(
    "section",
    { class: "sec", id: "achievements", "aria-labelledby": "achv-title" },
    [
      h("a", { id: "achv", class: "anch", "aria-hidden": "true" }),
      h("h3", { class: "section-title", id: "achv-title" }, "Achievements"),
      h("div", { class: "section-divider", "aria-hidden": "true" }),
      h("ul", { class: "list", style: "margin-top: 10px" }, lis),
    ]
  );
}

function renderEducation() {
  return h(
    "section",
    { class: "sec", id: "education", "aria-labelledby": "edu-title" },
    [
      h("a", { id: "edu", class: "anch", "aria-hidden": "true" }),
      h("h3", { class: "section-title", id: "edu-title" }, "Education"),
      h("div", { class: "section-divider", "aria-hidden": "true" }),
      h("div", { class: "about", style: "align-items: flex-start" }, [
        h("img", {
          class: "logo",
          src: siteData.education.logo,
          alt: "LNCT logo",
        }),
        h("div", { class: "about-card" }, [
          h("b", {}, siteData.education.headline),
          "<br />",
          siteData.education.details,
          "<br />",
          h("span", {}, siteData.education.meta),
        ]),
      ]),
    ]
  );
}

function renderContact() {
  return h(
    "section",
    { class: "sec", id: "contact", "aria-labelledby": "contact-title" },
    [
      h("h3", { class: "section-title", id: "contact-title" }, "Contact"),
      h("div", { class: "section-divider", "aria-hidden": "true" }),
      h(
        "form",
        {
          class: "contact-form",
          id: "contactFormEmailJS",
          onsubmit: (e) => e.preventDefault(),
        },
        [
          h("h4", { class: "sr-only" }, "Contact form"),
          h("input", {
            type: "text",
            name: "from_name",
            placeholder: "Your Name",
            required: "",
          }),
          h("input", {
            type: "email",
            name: "reply_to",
            placeholder: "Your Email",
            required: "",
          }),
          h("textarea", {
            name: "message",
            rows: "5",
            placeholder: "Your Message",
            required: "",
          }),
          h(
            "button",
            { type: "submit", id: "contactSubmitEmailJS" },
            "Send Message"
          ),
          h("p", {
            id: "contactStatusEmailJS",
            class: "muted",
            style: "margin-top: 0.6rem",
          }),
        ]
      ),
    ]
  );
}

function renderCertificates() {
  const cards = siteData.certificates.map((c) =>
    h("article", { class: "card" }, [
      h("img", { src: c.img, alt: `${c.title.split(" ")[0]} logo` }),
      h("div", { class: "card-content" }, [
        h("h4", {}, c.title),
        h(
          "p",
          {},
          `Issuer: ${c.issuer}<br /><span class="muted"> ${c.meta} </span>`
        ),
        h(
          "div",
          { style: "margin-top:12px; display:flex; gap:10px; flex-wrap:wrap;" },
          c.tags.map((t) =>
            h("span", { class: "skill", style: "cursor: default" }, t)
          )
        ),
        h(
          "div",
          { style: "margin-top:16px; display:flex; gap:12px; flex-wrap:wrap;" },
          [
            h(
              "a",
              {
                href: c.verify,
                target: "_blank",
                rel: "noopener",
                style: "text-decoration:none;",
              },
              [
                h(
                  "span",
                  {
                    style:
                      "display:inline-block; padding:10px 16px; border-radius:24px; background: var(--gradient); font-weight:700; font-size:.95rem;",
                  },
                  "Verify"
                ),
              ]
            ),
          ]
        ),
      ]),
    ])
  );
  return h(
    "section",
    { class: "sec", id: "certificates", "aria-labelledby": "certs-title" },
    [
      h("h3", { class: "section-title", id: "certs-title" }, "Certificates"),
      h("div", { class: "section-divider", "aria-hidden": "true" }),
      h(
        "div",
        { class: "carousel", "data-mode": "continuous", "data-speed": "0.45" },
        [
          h(
            "div",
            { class: "carousel-track", id: "certs-track", role: "list" },
            cards
          ),
          h(
            "button",
            {
              class: "carousel-btn prev",
              "aria-label": "Previous",
              title: "Previous (pauses on hover)",
            },
            "‹"
          ),
          h(
            "button",
            {
              class: "carousel-btn next",
              "aria-label": "Next",
              title: "Next (pauses on hover)",
            },
            "›"
          ),
          h("div", { class: "carousel-dots", id: "certs-dots" }),
          h("div", { class: "carousel-status", "aria-live": "polite" }),
        ]
      ),
    ]
  );
}

function renderRecommendations() {
  const cards = siteData.recommendations.map((r) =>
    h("article", { class: "card rec", role: "listitem" }, [
      h("div", { class: "rec__head" }, [
        h("img", { class: "rec__avatar", src: r.avatar, alt: r.name }),
        h("div", { class: "rec__meta" }, [
          h("strong", {}, r.name),
          h("span", { class: "muted" }, r.title),
        ]),
      ]),
      h("div", { class: "rec__body" }, [
        h("span", { class: "rec__quote-mark", "aria-hidden": "true" }, "“"),
        h("p", { class: "rec__text" }, r.text),
      ]),
      h(
        "div",
        { class: "rec__tags" },
        r.tags.map((t) => h("span", { class: "skill", role: "listitem" }, t))
      ),
    ])
  );
  return h(
    "section",
    { class: "sec", id: "recommendations", "aria-labelledby": "recs-title" },
    [
      h("h3", { class: "section-title", id: "recs-title" }, "Recommendations"),
      h("div", { class: "section-divider", "aria-hidden": "true" }),
      h(
        "div",
        { class: "carousel", "data-mode": "continuous", "data-speed": "0.35" },
        [
          h(
            "div",
            { class: "carousel-track", id: "recs-track", role: "list" },
            cards
          ),
          h(
            "button",
            {
              class: "carousel-btn prev",
              "aria-label": "Previous",
              title: "Previous (pauses on hover)",
            },
            "‹"
          ),
          h(
            "button",
            {
              class: "carousel-btn next",
              "aria-label": "Next",
              title: "Next (pauses on hover)",
            },
            "›"
          ),
          h("div", { class: "carousel-dots", id: "recs-dots" }),
          h("div", { class: "carousel-status", "aria-live": "polite" }),
        ]
      ),
    ]
  );
}

function renderFooter() {
  return h(
    "footer",
    { role: "contentinfo" },
    "© 2025 Shubh Gupta. All Rights Reserved."
  );
}

function renderMain() {
  return h("main", { id: "main", tabindex: "-1" }, [
    renderHero(), // Home
    renderAbout(), // About
    renderExperience(), // Experience
    renderProjects(), // Projects
    renderSkills(), // Skills
    renderEducation(), // Education
    renderAchievements(), // Achievements
    renderCertificates(), // Certificates
    renderRecommendations(), // Recommendations
    renderContact(),
  ]);
}

// --------------- MOUNT --------------- //
(function mount() {
  const app = document.getElementById("app");
  app.appendChild(renderHeader());
  app.appendChild(renderMain());
  app.appendChild(renderFooter());
})();

// --------------- INTERACTIONS --------------- //

// EmailJS contact form handling
(function () {
  if (!window.emailjs) return;
  emailjs.init(siteData.contact.emailJs.publicKey);

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
      const formData = new FormData(form);
      const name = (formData.get("from_name") || "Website Visitor")
        .toString()
        .trim();
      const email = (formData.get("reply_to") || "").toString().trim();
      const title = document.title || "Portfolio";
      const rawMsg = (formData.get("message") || "").toString().trim();

      const whenIST = new Date().toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

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

      const subject = `Portfolio Inquiry • ${title} • ${whenIST}`;

      const params = {
        from_name: name,
        reply_to: email,
        subject,
        message: composedMessage,
        to_email: siteData.contact.emailTo,
      };

      await emailjs.send(
        siteData.contact.emailJs.serviceId,
        siteData.contact.emailJs.templateId,
        params
      );

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

// GitHub Projects loader
(async function loadRepos() {
  const grid = document.getElementById("projects-track");
  const status = document.getElementById("projects-status");

  if (!grid || !status) return;

  const { username, excludeForks, excludeArchived } = siteData.projects;
  const baseUrl = `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`;

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
          "User-Agent": username,
        },
      });

      if (!res.ok)
        throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);

      const page = await res.json();
      all.push(...page);

      const link = res.headers.get("Link");
      if (link && link.includes('rel="next"')) {
        const m = link.split(",").find((p) => p.includes('rel="next"'));
        next = m ? m.split(";")[0].trim().slice(1, -1) : null;
      } else next = null;
    }
    return all;
  }

  try {
    status.textContent = "Loading projects…";
    const repos = await fetchAll(baseUrl);

    let filtered = repos
      .filter((r) => !excludeArchived || !r.archived)
      .filter((r) => !excludeForks || !r.fork);

    filtered.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

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
                    ? `<a href="${live}" target="_blank" rel="noopener" style="text-decoration:none;">
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
    status.textContent = "";
    if (window.initCarousels) window.initCarousels();
    setTimeout(window.initCarousels, 300);
    setTimeout(window.initCarousels, 1200);
  } catch (err) {
    console.error(err);
    status.innerHTML = `
      <div style="color:#f88;">
        Couldn’t load projects from GitHub. ${err.message || ""}<br/>
        You can try again later.
      </div>`;
  }
})();

// Accessible burger nav toggle
(function () {
  const body = document.body;
  const btn = document.querySelector(".nav-toggle");
  const nav = document.getElementById("primary-nav");

  if (!btn || !nav) return;

  function setOpen(open) {
    btn.setAttribute("aria-expanded", String(open));
    body.classList.toggle("nav-open", open);
    if (open) {
      const first = nav.querySelector(
        'a, button, [tabindex]:not([tabindex="-1"])'
      );
      if (first) first.focus({ preventScroll: true });
    } else {
      btn.focus({ preventScroll: true });
    }
  }

  btn.addEventListener("click", () => {
    const isOpen = body.classList.contains("nav-open");
    setOpen(!isOpen);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && body.classList.contains("nav-open"))
      setOpen(false);
  });

  document.addEventListener("click", (e) => {
    if (!body.classList.contains("nav-open")) return;
    const within =
      e.target === nav ||
      nav.contains(e.target) ||
      e.target === btn ||
      btn.contains(e.target);
    if (!within) setOpen(false);
  });

  nav.addEventListener("click", (e) => {
    const t = e.target.closest("a");
    if (t) setOpen(false);
  });
})();

// Typewriter
(function () {
  const el = document.getElementById("typewriter");
  if (!el) return;
  const PHRASES = siteData.hero.phrases;
  const TYPE_BASE = 130,
    TYPE_VAR = 35,
    DELETE_BASE = 70,
    DELETE_VAR = 20;
  const HOLD_AFTER_TYPE = 1200,
    HOLD_AFTER_DELETE = 300;

  const reduceMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) {
    el.textContent = PHRASES[1] || el.textContent;
    return;
  }

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const jitter = (base, varr) =>
    Math.max(10, base + (Math.random() * 2 - 1) * varr);

  async function type(text) {
    el.textContent = "";
    for (let i = 0; i < text.length; i++) {
      el.textContent = text.slice(0, i + 1);
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
      await type(phrase);
      await sleep(HOLD_AFTER_TYPE);
      await del(phrase);
      await sleep(HOLD_AFTER_DELETE);
      idx++;
    }
  })();
})();

// --------------- CAROUSEL INITIALIZER (continuous + paged) --------------- //
window.initCarousels = function () {
  const reduceMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function setupCarousel(root) {
    if (root.dataset.inited === "1") return;
    const track = root.querySelector(".carousel-track");
    const prev = root.querySelector(".carousel-btn.prev");
    const next = root.querySelector(".carousel-btn.next");
    const dotsWrap = root.querySelector(".carousel-dots");
    const statusEl = root.querySelector(".carousel-status");
    if (!track) return;

    const mode = root.dataset.mode || "paged"; // "continuous" or "paged"
    const speed = Math.max(0.1, parseFloat(root.dataset.speed || "0.5")); // px per frame

    function ensureOverflow() {
      try {
        const maxLoops = 6; // be generous but bounded
        const base = Array.from(track.children).slice(0); // snapshot current set to clone from
        let loops = 0;
        // If no items, nothing to do
        if (!base.length) return;
        // Keep cloning until scrollable width exceeds container sufficiently
        while (
          track.scrollWidth <=
            track.clientWidth +
              (base[0].getBoundingClientRect().width || 300) &&
          loops < maxLoops
        ) {
          base.forEach((n) => track.appendChild(n.cloneNode(true)));
          loops++;
        }
      } catch (_) {
        /* no-op */
      }
    }

    // Items
    let items = Array.from(track.children);

    // For continuous mode, duplicate children for seamless loop
    if (mode === "continuous" && items.length) {
      const clone = items.map((n) => n.cloneNode(true));
      clone.forEach((n) => track.appendChild(n));
      // Ensure we have enough width to scroll
      ensureOverflow();
      items = Array.from(track.children);
      track.classList.add("no-snap");
      if (dotsWrap) dotsWrap.style.display = "none";
    } else {
      // Build dots for paged mode
      if (dotsWrap) {
        dotsWrap.innerHTML = "";
        items.forEach((_, i) => {
          const d = document.createElement("span");
          d.className = "carousel-dot" + (i === 0 ? " active" : "");
          d.dataset.index = i;
          dotsWrap.appendChild(d);
        });
      }
    }

    const dots = dotsWrap ? Array.from(dotsWrap.children) : [];

    // Start with first active
    items.forEach((it, idx) => it.classList.toggle("is-active", idx === 0));
    let current = 0;
    function setPausedIndicator(p) {
      if (!statusEl) return;
      statusEl.textContent = p ? "Paused" : "";
      statusEl.classList.toggle("show", !!p);
    }
    let rafId = null;
    let paused = false;

    function toIndex(i) {
      if (mode === "continuous") return; // ignore in continuous
      const target = items[i];
      if (!target) return;
      const left = target.offsetLeft;
      track.scrollTo({ left, behavior: "smooth" });
      dots.forEach((d, idx) => d.classList.toggle("active", idx === i));
      items.forEach((it, idx) => it.classList.toggle("is-active", idx === i));
      current = i;
    }

    // Buttons jump by one card width (works for both modes)
    function jump(dir) {
      if (mode === "continuous") {
        const card = items[0];
        const step = card ? card.getBoundingClientRect().width + 20 : 300;
        track.scrollTo({
          left: track.scrollLeft + dir * step,
          behavior: "smooth",
        });
      } else {
        toIndex(Math.min(items.length - 1, Math.max(0, current + dir)));
      }
    }
    prev?.addEventListener("click", () => jump(-1));
    next?.addEventListener("click", () => jump(1));
    dots.forEach((d) =>
      d.addEventListener("click", () =>
        toIndex(parseInt(d.dataset.index || "0", 10))
      )
    );

    // Update active by observing scroll
    let scrollTimer;
    track.addEventListener(
      "scroll",
      () => {
        if (scrollTimer) cancelAnimationFrame(scrollTimer);
        scrollTimer = requestAnimationFrame(() => {
          const center = track.scrollLeft + track.clientWidth / 2;
          let closest = 0,
            closestDist = Infinity;
          items.forEach((it, i) => {
            const left = it.offsetLeft + it.offsetWidth / 2;
            const dist = Math.abs(left - center);
            if (dist < closestDist) {
              closestDist = dist;
              closest = i;
            }
          });
          dots.forEach((d, idx) =>
            d.classList.toggle("active", idx === closest)
          );
          items.forEach((it, idx) =>
            it.classList.toggle("is-active", idx === closest)
          );
          current = closest;
        });
      },
      { passive: true }
    );

    // Continuous animation
    function loop() {
      if (paused || reduceMotion || mode !== "continuous") return;
      const max = track.scrollWidth / 2; // base wrap; we duplicated at least once and possibly more
      let nextLeft = track.scrollLeft + speed;
      if (nextLeft >= max) nextLeft -= max; // wrap seamlessly
      track.scrollLeft = nextLeft;
      rafId = requestAnimationFrame(loop);
    }

    function start() {
      if (mode === "continuous" && !reduceMotion) {
        if (!rafId) rafId = requestAnimationFrame(loop);
      }
    }
    function stop() {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = null;
    }

    // Pause on hover/focus/touch
    root.addEventListener("mouseenter", () => {
      paused = true;
      stop();
      setPausedIndicator(true);
    });
    root.addEventListener("mouseleave", () => {
      paused = false;
      start();
      setPausedIndicator(false);
    });
    root.addEventListener("focusin", () => {
      paused = true;
      stop();
      setPausedIndicator(true);
    });
    root.addEventListener("focusout", () => {
      paused = false;
      start();
      setPausedIndicator(false);
    });
    root.addEventListener(
      "touchstart",
      () => {
        paused = true;
        stop();
        setPausedIndicator(true);
      },
      { passive: true }
    );
    root.addEventListener(
      "touchend",
      () => {
        paused = false;
        start();
        setPausedIndicator(false);
      },
      { passive: true }
    );

    // Kick off
    start();
    // Mark as initialized only if we have items
    if (track && track.children && track.children.length) {
      root.dataset.inited = "1";
    }
  }

  document.querySelectorAll(".carousel").forEach(setupCarousel);
  // mark initialized
};
window.initCarousels();
setTimeout(window.initCarousels, 300);
setTimeout(window.initCarousels, 1200);
