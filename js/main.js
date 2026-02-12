import { BackgroundAnimation } from './modules/background.js';
import { I18n } from './modules/i18n.js';
import { throttle, isMobile } from './modules/utils.js';

// Initialize i18n
const i18n = new I18n();
window.i18n = i18n; // Make it globally accessible

// Initialize background animation
const bgAnimation = new BackgroundAnimation();

// Initialize theme and language based on saved preferences
document.addEventListener("DOMContentLoaded", () => {
  // Set initial language
  i18n.updatePage();

  // Initialize all event listeners and animations
  initializeApp();
});

function initializeApp() {
  const body = document.body;
  const buttons = document.querySelectorAll(".sidebar-btn, .sidebar-logo-btn, .sidebar-theme-btn");
  const scrollContainer = document.querySelector(".horizontal-scroll-container");
  const sectionOrder = ["welcome", "about-me", "stack", "projects", "services"];
  let currentSectionIndex = 1;

  // Language selector
  initLanguageSelector();

  // Theme toggle
  initThemeToggle();

  // Lamp swinging animation
  initLampAnimation();

  // Navigation
  initNavigation();

  // Mini-game
  initMiniGame();

  // Sudoku
  initSudoku();

  // Year typing animation
  initYearAnimation();

  // Card tilt effects
  initCardEffects();

  // Mouse follower circle
  initMouseCircle();
}

function initLanguageSelector() {
  const langButtons = document.querySelectorAll('.lang-btn');
  if (!langButtons.length) return;

  const currentLang = i18n.getCurrentLanguage();

  langButtons.forEach(btn => {
    if (btn.dataset.lang === currentLang) {
      btn.classList.add('active');
    }

    btn.addEventListener('click', () => {
      langButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      i18n.setLanguage(btn.dataset.lang);
    });
  });
}

function initThemeToggle() {
  const body = document.body;
  const lampButton = document.getElementById("light-dark-btn");

  if (!lampButton) return;

  lampButton.addEventListener('click', () => {
    const isDark = !body.classList.contains("dark");
    body.classList.toggle("dark");

    localStorage.setItem("theme", isDark ? "dark" : "default");

    // Update all theme-dependent elements
    document.querySelectorAll(".btn, .sidebar-btn").forEach((btn) => btn.classList.toggle("dark"));
    document.querySelectorAll(".swiper-button-prev, .swiper-button-next").forEach((arrow) => arrow.classList.toggle("dark"));
    document.querySelectorAll(".theme-secondary").forEach((el) => el.classList.toggle("dark"));
    document.querySelectorAll(".project-card").forEach((card) => card.classList.toggle("dark", isDark));
    document.querySelectorAll("#stack .category, #stack .stack_block").forEach((el) => el.classList.toggle("dark"));
    document.querySelector(".theme-icon")?.classList.toggle("dark");
    document.querySelector(".theme-icon-dark")?.classList.toggle("dark");

    bgAnimation.updateTheme(isDark);
  });

  // Load saved theme
  const savedTheme = localStorage.getItem("theme") ||
    (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "default");

  if (savedTheme === "dark") {
    lampButton.click();
  }
}

function initLampAnimation() {
  if (isMobile()) return;

  const lampButton = document.getElementById("light-dark-btn");
  if (!lampButton) return;

  let lampAngle = 0;
  let lampVelocity = 0;
  const lampDamping = 0.94;
  const lampStiffness = 0.06;
  const lampNaturalSwing = 0.08;

  function updateLampSwing() {
    const time = Date.now() * 0.001;
    const swingForce = Math.sin(time * 1.2) * lampNaturalSwing;

    lampVelocity += swingForce;
    lampVelocity += -lampAngle * lampStiffness;
    lampVelocity *= lampDamping;
    lampAngle += lampVelocity;

    const activeLamp = document.body.classList.contains("dark")
      ? lampButton.querySelector(".theme-icon-dark")
      : lampButton.querySelector(".theme-icon");

    if (activeLamp) {
      activeLamp.style.transform = `rotate(${lampAngle}deg)`;
    }

    requestAnimationFrame(updateLampSwing);
  }

  updateLampSwing();
}

function initNavigation() {
  const buttons = document.querySelectorAll(".sidebar-btn");
  const scrollContainer = document.querySelector(".horizontal-scroll-container");
  const sectionOrder = ["welcome", "about-me", "stack", "projects", "services"];
  let currentSectionIndex = 1;

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetId = button.getAttribute("data-target");

      if (targetId === "theme") return; // Theme button handled separately

      const targetSection = document.getElementById(targetId);
      if (!targetSection) return;

      targetSection.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'start' });

      buttons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      currentSectionIndex = sectionOrder.indexOf(targetId);

      // Trigger section-specific animations
      handleSectionAnimation(targetId);
    });
  });

  // Scroll detection
  if (scrollContainer) {
    scrollContainer.addEventListener('scroll', () => {
      const sections = document.querySelectorAll('.scroll-section');
      let currentIndex = 0;

      sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        if (rect.left >= 0 && rect.left < window.innerWidth / 2) {
          currentIndex = index;
        }
      });

      if (currentIndex !== currentSectionIndex) {
        currentSectionIndex = currentIndex;
        const currentSection = sectionOrder[currentIndex];
        const targetButton = document.querySelector(`[data-target="${currentSection}"]`);

        buttons.forEach((btn) => btn.classList.remove("active"));
        if (targetButton) {
          targetButton.classList.add("active");
        }
      }
    }, { passive: true });
  }
}

function handleSectionAnimation(sectionId) {
  // This will be implemented based on section needs
  console.log(`Animating section: ${sectionId}`);
}

function initMiniGame() {
  // Mini-game initialization will go here
}

function initSudoku() {
  // Sudoku initialization will go here
}

function initYearAnimation() {
  // Year animation will go here
}

function initCardEffects() {
  const cards = document.querySelectorAll(".card, .project-card, .stack_block");

  if (window.matchMedia("(pointer: coarse)").matches) return; // Skip on touch devices

  cards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 10;
      const rotateY = (x - centerX) / 10;

      requestAnimationFrame(() => {
        card.style.transform = `perspective(1000px) rotateX(${-rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        card.style.boxShadow = `${-(x - centerX) / 10}px ${-(y - centerY) / 10}px 2em rgba(0,0,0,0.15)`;
      });
    });

    card.addEventListener("mouseleave", () => {
      requestAnimationFrame(() => {
        card.style.transform = "perspective(1000px) rotateX(0) rotateY(0) scale(1)";
        card.style.boxShadow = "0 4px 20px rgba(0,0,0,0.1)";
      });
    });
  });
}

function initMouseCircle() {
  const circle = document.createElement("div");
  Object.assign(circle.style, {
    position: "fixed",
    width: "1rem",
    height: "1rem",
    backgroundColor: "#333333",
    borderRadius: "50%",
    pointerEvents: "none",
    zIndex: "1000",
    transform: "translate(-50%, -50%)",
  });
  circle.id = "circle";
  document.body.appendChild(circle);

  let mouseX = 0, mouseY = 0;
  let circleX = 0, circleY = 0;
  const circleSpeed = 0.02;

  document.addEventListener("mousemove", throttle((e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }, 16));

  function animateCircle() {
    circleX += (mouseX + 10 - circleX) * circleSpeed;
    circleY += (mouseY - 50 - circleY) * circleSpeed;
    circle.style.transform = `translate(${circleX}px, ${circleY}px)`;
    requestAnimationFrame(animateCircle);
  }
  animateCircle();
}
