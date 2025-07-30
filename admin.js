// admin.js
// Simple JSON-based editor for siteData. Saves to localStorage ('siteData').

const DEFAULTS_URL = null; // not used (we inline defaults to avoid extra requests)

// Inline a copy of DEFAULT_SITE_DATA to avoid loading app.js on admin page
const DEFAULT_SITE_DATA = (function(){ return {
  meta: { name: "Shubh Gupta", tagline: "Java Developer | Microservices | Spring Boot | Cloud Enthusiast" },
  nav: [
    { href: "#home", label: "Home", current: true },
    { href: "#about", label: "About" },
    { href: "#projects-section", label: "Projects" },
    { href: "#skills", label: "Skills" },
    { href: "#achievements", label: "Achievements" },
    { href: "#education", label: "Education" },
    { href: "#portfolio", label: "Experience" },
    { href: "#contact", label: "Contact" }
  ],
  hero: {
    phrases: [
      "Hi, I'm Shubh Gupta",
      "Java & Spring Boot Developer",
      "I build scalable event‑driven microservices",
      "Kafka • Spring WebFlux • AWS • DDD",
      "Thanks for visiting my portfolio"
    ],
    socials: [
      { href: "https://www.linkedin.com/in/shubh-guptaa/", img: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linkedin/linkedin-original.svg", alt: "LinkedIn" },
      { href: "https://github.com/ShubhGupta25/", img: "https://cdn.simpleicons.org/github/ffffff", alt: "GitHub" },
      { href: "https://leetcode.com/ShubhGupta25/", img: "https://cdn.simpleicons.org/leetcode/ffffff", alt: "LeetCode" }
    ]
  },
  about: {
    avatar: "https://avatars.githubusercontent.com/u/86280855?v=4",
    text: "Java developer with 2 years of experience in event-driven microservices and legacy modernization using Java and Spring Boot.<br /><br /><b>Location:</b> Bengaluru, Karnataka<br /><b>Email:</b> shubhgupta036@gmail.com<br /><b>Phone:</b> +91 9752897467"
  },
  experience: [
    {
      logo: "https://cdn.simpleicons.org/infosys/0a74ff",
      role: "Specialist Programmer, Infosys",
      desc: "<b>02/2024 – Present | Bangalore, Karnataka</b><br />Engineer III (Contractor) at American Express.<br />• Migrated legacy mainframe systems to Java microservices using Spring Boot.<br />• Built a configurable, global codebase supporting multiple markets.<br />• Developed a rule engine with ANTLR for dynamic business logic.<br />• Implemented Kafka-based batch and real-time pipeline for data delivery.<br />• Automated binary data transformation for seamless integration.<br />• Configured a variety of products for different markets.<br /><i>Tech: DDD, Event-driven Architecture, Reactive Programming, TDD, BDD</i>"
    },
    {
      logo: "https://cdn.simpleicons.org/cognizant/00c7fd",
      role: "Programmer Analyst, Cognizant",
      desc: "<b>01/2023 – 01/2024 | Chennai, Tamil Nadu</b><br />Internship & Full-Time (offer delayed due to restructuring).<br />• Built RESTful APIs using Spring Boot with AWS Lambda and API Gateway.<br />• Contributed to POCs using AWS services like S3, DynamoDB, and CloudWatch."
    }
  ],
  skills: ["Java SE","Spring Boot","Spring WebFlux","REST & GraphQL APIs","Microservices","C++","TypeScript","SQL","Cassandra","MySQL","MongoDB","PostgreSQL","Kafka","AWS","Jenkins","GitHub Actions","Docker","Kubernetes","OOP","TDD/BDD","JUnit","Cucumber","Problem Solving"],
  achievements: [
    "Secured 2nd place in the Infosys Hackathon by developing a talent acquisition solution.",
    "Achieved a LeetCode rating of 1872 and earned the Knight Badge (top 5% of all users)."
  ],
  education: {
    logo: "https://lnct.ac.in/wp-content/uploads/2021/04/LNCT-Logo.png",
    headline: "Lakshmi Narain College Of Technology",
    details: "Bachelor Of Technology | Computer Science Engineering",
    meta: "05/2023 | Bhopal, Madhya Pradesh"
  },
  certificates: [
    { img: "https://cdn.simpleicons.org/coursera/2A73CC", title: "Microservices with Spring Boot", issuer: "Coursera • Specialization", meta: "Issued: Feb 2024 • Credential ID: ABCD-1234", tags: ["Spring Boot","Microservices","Kafka"], verify: "https://www.coursera.org/account/accomplishments/verify/ABCD1234" },
    { img: "https://cdn.simpleicons.org/udemy/A435F0", title: "Advanced Java Programming", issuer: "Udemy", meta: "Issued: Nov 2023 • Credential ID: UDE-5678", tags: ["Java","Design Patterns","JUnit"], verify: "https://www.udemy.com/certificate/UC-XXXXXX/" },
    { img: "https://cdn.simpleicons.org/amazonaws/FF9900", title: "AWS Cloud Practitioner", issuer: "Amazon Web Services", meta: "Issued: Aug 2023 • Credential ID: AWS-CLF-9999", tags: ["AWS","Cloud","Security"], verify: "https://www.credly.com/badges/" }
  ],
  recommendations: [
    { avatar: "https://i.pravatar.cc/120?img=14", name: "Priya Sharma", title: "Engineering Manager • American Express", text: "Shubh ramped up quickly on a complex legacy modernization project and consistently delivered high‑quality, well‑tested microservices. His ownership and calm under pressure made him the go‑to engineer for critical paths.", tags: ["Ownership","Spring Boot","Kafka"] }
  ],
  projects: { username: "ShubhGupta25", excludeForks: true, excludeArchived: true },
  contact: { emailTo: "shubhgupta036@gmail.com", emailJs: { publicKey: "ba_tX09M9-yxsoWnK", serviceId: "service_bezinql", templateId: "template_0in6erd" } }
}; })();

const els = {
  editor: document.getElementById("editor"),
  btnLoadDefaults: document.getElementById("btnLoadDefaults"),
  btnLoadSaved: document.getElementById("btnLoadSaved"),
  btnValidate: document.getElementById("btnValidate"),
  btnSave: document.getElementById("btnSave"),
  btnExport: document.getElementById("btnExport"),
  btnImport: document.getElementById("btnImport"),
  fileImport: document.getElementById("fileImport"),
  status: document.getElementById("status"),
  qaSkill: document.getElementById("qaSkill"),
  btnAddSkill: document.getElementById("btnAddSkill"),
  qaCertTitle: document.getElementById("qaCertTitle"),
  qaCertIssuer: document.getElementById("qaCertIssuer"),
  qaCertMeta: document.getElementById("qaCertMeta"),
  qaCertUrl: document.getElementById("qaCertUrl"),
  qaCertImg: document.getElementById("qaCertImg"),
  qaCertTags: document.getElementById("qaCertTags"),
  btnAddCert: document.getElementById("btnAddCert"),
  // About update
  aboutAvatar: document.getElementById("aboutAvatar"),
  aboutText: document.getElementById("aboutText"),
  btnUpdateAbout: document.getElementById("btnUpdateAbout"),
  // Experience quick add
  qaExpLogo: document.getElementById("qaExpLogo"),
  qaExpRole: document.getElementById("qaExpRole"),
  qaExpDesc: document.getElementById("qaExpDesc"),
  btnAddExp: document.getElementById("btnAddExp"),
  // Recommendation quick add
  qaRecAvatar: document.getElementById("qaRecAvatar"),
  qaRecName: document.getElementById("qaRecName"),
  qaRecTitle: document.getElementById("qaRecTitle"),
  qaRecText: document.getElementById("qaRecText"),
  qaRecTags: document.getElementById("qaRecTags"),
  btnAddRec: document.getElementById("btnAddRec"),
  // Achievement quick add
  qaAchText: document.getElementById("qaAchText"),
  btnAddAch: document.getElementById("btnAddAch"),
};

function setStatus(msg, cls="muted") {
  els.status.className = cls;
  els.status.textContent = msg;
}

function loadDefaults() {
  els.editor.value = JSON.stringify(DEFAULT_SITE_DATA, null, 2);
  setStatus("Loaded defaults.", "muted");
}

function loadSaved() {
  try {
    const saved = localStorage.getItem("siteData");
    if (!saved) return setStatus("No saved data found in this browser.", "muted");
    const parsed = JSON.parse(saved);
    els.editor.value = JSON.stringify(parsed, null, 2);
    setStatus("Loaded saved data.", "muted");
  } catch (e) {
    console.error(e);
    setStatus("Failed to load saved data.", "error");
  }
}

function validate() {
  try {
    const parsed = JSON.parse(els.editor.value);
    if (!parsed.meta || !parsed.nav) throw new Error("Missing required keys like meta/nav.");
    setStatus("JSON is valid ✔", "success");
    return parsed;
  } catch (e) {
    setStatus("Invalid JSON: " + e.message, "error");
    return null;
  }
}

function save() {
  const parsed = validate();
  if (!parsed) return;
  try {
    localStorage.setItem("siteData", JSON.stringify(parsed));
    setStatus("Saved to browser. Open index.html to see changes.", "success");
  } catch (e) {
    console.error(e);
    setStatus("Save failed: " + e.message, "error");
  }
}

function exportJson() {
  try {
    const blob = new Blob([els.editor.value], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "siteData.json";
    a.click();
    URL.revokeObjectURL(url);
    setStatus("Exported siteData.json", "success");
  } catch (e) {
    console.error(e);
    setStatus("Export failed: " + e.message, "error");
  }
}

function importJson() {
  els.fileImport.click();
}

function onFileChosen(e) {
  const file = e.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    els.editor.value = reader.result;
    setStatus("Imported JSON (not saved yet). Click Validate -> Save.", "muted");
  };
  reader.readAsText(file);
}

// Quick Add helpers
function updateAbout() {
  const avatar = (els.aboutAvatar.value || "").trim();
  const text = (els.aboutText.value || "").trim();
  try {
    const data = JSON.parse(els.editor.value || "{}");
    data.about = data.about || {};
    if (avatar) data.about.avatar = avatar;
    if (text) data.about.text = text;
    els.editor.value = JSON.stringify(data, null, 2);
    setStatus("About section updated in editor (remember to Validate → Save).", "success");
  } catch (e) {
    setStatus("Fix JSON in editor before updating About.", "error");
  }
}

function addExperience() {
  const logo = (els.qaExpLogo.value || "").trim();
  const role = (els.qaExpRole.value || "").trim();
  const desc = (els.qaExpDesc.value || "").trim();
  if (!role) return setStatus("Role is required for experience.", "muted");
  try {
    const data = JSON.parse(els.editor.value || "{}");
    data.experience = Array.isArray(data.experience) ? data.experience : [];
    data.experience.push({ logo, role, desc });
    els.editor.value = JSON.stringify(data, null, 2);
    els.qaExpLogo.value = els.qaExpRole.value = "";
    els.qaExpDesc.value = "";
    setStatus("Experience added.", "success");
  } catch (e) {
    setStatus("Fix JSON in editor before adding experience.", "error");
  }
}

function addRecommendation() {
  const avatar = (els.qaRecAvatar.value || "").trim();
  const name = (els.qaRecName.value || "").trim();
  const title = (els.qaRecTitle.value || "").trim();
  const text = (els.qaRecText.value || "").trim();
  const tags = (els.qaRecTags.value || "").split(",").map(s=>s.trim()).filter(Boolean);
  if (!name || !text) return setStatus("Name and Recommendation text are required.", "muted");
  try {
    const data = JSON.parse(els.editor.value || "{}");
    data.recommendations = Array.isArray(data.recommendations) ? data.recommendations : [];
    data.recommendations.push({ avatar, name, title, text, tags });
    els.editor.value = JSON.stringify(data, null, 2);
    els.qaRecAvatar.value = els.qaRecName.value = els.qaRecTitle.value = els.qaRecText.value = els.qaRecTags.value = "";
    setStatus("Recommendation added.", "success");
  } catch (e) {
    setStatus("Fix JSON in editor before adding recommendation.", "error");
  }
}

function addAchievement() {
  const text = (els.qaAchText.value || "").trim();
  if (!text) return setStatus("Enter an achievement first.", "muted");
  try {
    const data = JSON.parse(els.editor.value || "{}");
    data.achievements = Array.isArray(data.achievements) ? data.achievements : [];
    data.achievements.push(text);
    els.editor.value = JSON.stringify(data, null, 2);
    els.qaAchText.value = "";
    setStatus("Achievement added.", "success");
  } catch (e) {
    setStatus("Fix JSON in editor before adding achievement.", "error");
  }
}

function addSkill() {
  const skill = (els.qaSkill.value || "").trim();
  if (!skill) return setStatus("Enter a skill first.", "muted");
  try {
    const data = JSON.parse(els.editor.value);
    data.skills = Array.isArray(data.skills) ? data.skills : [];
    data.skills.push(skill);
    els.editor.value = JSON.stringify(data, null, 2);
    els.qaSkill.value = "";
    setStatus(`Added skill: ${skill}.`, "success");
  } catch (e) {
    setStatus("Fix JSON in editor before using Quick Add.", "error");
  }
}

function addCert() {
  const title = (els.qaCertTitle.value || "").trim();
  const issuer = (els.qaCertIssuer.value || "").trim();
  const meta = (els.qaCertMeta.value || "").trim();
  const verify = (els.qaCertUrl.value || "").trim();
  const img = (els.qaCertImg.value || "").trim();
  const tags = (els.qaCertTags.value || "").split(",").map(s=>s.trim()).filter(Boolean);

  if (!title || !issuer) return setStatus("Title and Issuer are required for a certificate.", "muted");

  try {
    const data = JSON.parse(els.editor.value);
    data.certificates = Array.isArray(data.certificates) ? data.certificates : [];
    data.certificates.push({ title, issuer, meta, verify, img, tags });
    els.editor.value = JSON.stringify(data, null, 2);
    els.qaCertTitle.value = els.qaCertIssuer.value = els.qaCertMeta.value = els.qaCertUrl.value = els.qaCertImg.value = els.qaCertTags.value = "";
    setStatus(`Added certificate: ${title}.`, "success");
  } catch (e) {
    setStatus("Fix JSON in editor before using Quick Add.", "error");
  }
}

// Wire up events
els.btnLoadDefaults.addEventListener("click", loadDefaults);
els.btnLoadSaved.addEventListener("click", loadSaved);
els.btnValidate.addEventListener("click", validate);
els.btnSave.addEventListener("click", save);
els.btnExport.addEventListener("click", exportJson);
els.btnImport.addEventListener("click", importJson);
els.fileImport.addEventListener("change", onFileChosen);
els.btnAddSkill.addEventListener("click", addSkill);
els.btnAddCert.addEventListener("click", addCert);
els.btnUpdateAbout.addEventListener("click", updateAbout);
els.btnAddExp.addEventListener("click", addExperience);
els.btnAddRec.addEventListener("click", addRecommendation);
els.btnAddAch.addEventListener("click", addAchievement);

// Initialize editor with saved or defaults
(function init() {
  const saved = localStorage.getItem("siteData");
  if (saved) {
    els.editor.value = JSON.stringify(JSON.parse(saved), null, 2);
    setStatus("Loaded saved data from your browser.", "muted");
  } else {
    loadDefaults();
  }
})();