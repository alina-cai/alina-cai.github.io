const storageKey = "alina-theme";
const root = document.documentElement;
root.classList.remove("no-js");
root.classList.add("js-ready");
const themeToggle = document.querySelector("[data-theme-toggle]");
const themeLabel = themeToggle?.querySelector(".theme-toggle__label");

const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");

const getInitialTheme = () => {
  const stored = localStorage.getItem(storageKey);
  if (stored === "dark" || stored === "light") {
    return stored;
  }
  return "dark";
};

const applyTheme = (value) => {
  root.setAttribute("data-theme", value);
  localStorage.setItem(storageKey, value);
  if (themeLabel) {
    themeLabel.textContent = value;
  }
  if (themeToggle) {
    const next = value === "dark" ? "light" : "dark";
    themeToggle.setAttribute("aria-label", `Switch to ${next} theme`);
  }
};

applyTheme(getInitialTheme());

themeToggle?.addEventListener("click", () => {
  const current = root.getAttribute("data-theme") === "dark" ? "dark" : "light";
  const next = current === "dark" ? "light" : "dark";
  applyTheme(next);
  window.location.reload();
});

prefersDark.addEventListener("change", (event) => {
  const stored = localStorage.getItem(storageKey);
  if (!stored) {
    applyTheme(event.matches ? "dark" : "light");
  }
});

const animatedElements = document.querySelectorAll("[data-animate]");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.2,
    rootMargin: "0px 0px -80px 0px",
  }
);

animatedElements.forEach((el) => observer.observe(el));

const layeredElements = document.querySelectorAll("[data-layer]");
const kineticElements = document.querySelectorAll("[data-scroll-animate]");
const navToggle = document.querySelector(".nav__toggle");
const navLinks = document.getElementById("nav-links");
let ticking = false;

const runScrollEffects = () => {
  const scrollY = window.scrollY;
  layeredElements.forEach((el) => {
    const depth = parseFloat(el.dataset.layer || "0.1");
    const offset = scrollY * depth * -0.08;
    el.style.setProperty("--layer-offset", `${offset}px`);
  });
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 1;
  kineticElements.forEach((el) => {
    const rect = el.getBoundingClientRect();
    const elementCenter = rect.top + rect.height / 2;
    const distance = (viewportHeight / 2 - elementCenter) / (viewportHeight / 2);
    const clamped = Math.max(-1, Math.min(1, distance));
    const translate = clamped * 16;
    const rotate = clamped * -1.2;
    const glow = Math.abs(clamped);
    el.style.setProperty("--scroll-translate", `${translate}px`);
    el.style.setProperty("--scroll-rotate", `${rotate}deg`);
    el.style.setProperty("--scroll-glow", glow.toFixed(3));
  });
  ticking = false;
};

window.addEventListener(
  "scroll",
  () => {
    if (!ticking) {
      window.requestAnimationFrame(runScrollEffects);
      ticking = true;
    }
  },
  { passive: true }
);

window.addEventListener("resize", runScrollEffects);
runScrollEffects();

// mobile nav menu removed on small screens per design; no toggle wiring needed

const yearSpan = document.getElementById("year");
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

const factButtons = document.querySelectorAll("[data-fact-toggle]");
factButtons.forEach((button) => {
  const container = button.closest(".fun-fact");
  const content = container?.querySelector(".fun-fact__content");
  button.addEventListener("click", () => {
    if (!content || !container) {
      return;
    }
    const isOpen = button.getAttribute("aria-expanded") === "true";
    button.setAttribute("aria-expanded", (!isOpen).toString());
    container.classList.toggle("is-open", !isOpen);
    content.hidden = isOpen;
  });
});

const setupTypewriter = () => {
  const wrapper = document.querySelector("[data-typewriter]");
  if (!wrapper) {
    return;
  }
  const textTarget = wrapper.querySelector("[data-type-text]");
  const cursor = wrapper.querySelector(".typewriter__cursor");
  if (!textTarget) {
    return;
  }
  const message = (textTarget.getAttribute("data-type-text") || textTarget.textContent || "").trim();
  if (!message.length) {
    return;
  }
  textTarget.textContent = "";
  let index = 0;
  const typeNext = () => {
    if (index < message.length) {
      textTarget.textContent += message.charAt(index);
      index += 1;
      const char = message.charAt(index - 1);
      const spacePause = char === " " ? 140 : 0;
      const organicPause = Math.random() > 0.78 ? 120 : 0;
      const delay = 80 + Math.random() * 90 + spacePause + organicPause;
      setTimeout(typeNext, delay);
    } else if (cursor) {
      cursor.classList.add("typewriter__cursor--complete");
    }
  };
  setTimeout(typeNext, 260);
};

if (document.readyState === "complete" || document.readyState === "interactive") {
  setupTypewriter();
} else {
  document.addEventListener("DOMContentLoaded", setupTypewriter);
}
