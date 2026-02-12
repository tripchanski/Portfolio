// Cache mobile detection globally
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;

class BackgroundAnimation {
  constructor() {
    this.canvas = document.getElementById("background-canvas");
    this.ctx = this.canvas.getContext("2d", { alpha: true });
    this.orbits = [];
    this.particles = [];
    this.isDark = false;
    this.mouse = { x: 0, y: 0 };
    this.isVisible = true;
    this.animationId = null;

    this.resize();
    let resizeTimeout;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => this.resize(), 150);
    }, { passive: true });

    // Track mouse for interactive effects (only on desktop)
    if (!isMobile) {
      window.addEventListener("mousemove", (e) => {
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;
      }, { passive: true });
    }

    // Page Visibility API - stop animations when page is hidden
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        this.isVisible = false;
        if (this.animationId) {
          cancelAnimationFrame(this.animationId);
          this.animationId = null;
        }
      } else {
        this.isVisible = true;
        if (!this.animationId) {
          this.animate();
        }
      }
    });

    this.init();
    this.animate();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.centerX = this.canvas.width / 2;
    this.centerY = this.canvas.height / 2;
  }

  init() {

    // HEAVILY REDUCED for performance
    const orbitCount = isMobile ? 2 : 3;
    for (let i = 0; i < orbitCount; i++) {
      const radius = 100 + i * 80;
      const speed = 0.0005 + i * 0.0003;
      const planetCount = isMobile ? 1 : 2;

      this.orbits.push({
        radius,
        speed,
        angle: Math.random() * Math.PI * 2,
        planets: this.createPlanets(planetCount, radius),
      });
    }

    const particleCount = isMobile ? 8 : 15;
    for (let i = 0; i < particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        radius: Math.random() * 2 + 1,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.5 + 0.2,
      });
    }

    this.stars = [];
    const starCount = isMobile ? 12 : 20;
    for (let i = 0; i < starCount; i++) {
      let x, y;
      const edge = Math.random();
      const margin = 300;

      if (edge < 0.5) {
        // Left or right edge
        x = Math.random() < 0.5 ? Math.random() * margin : this.canvas.width - Math.random() * margin;
        y = Math.random() * this.canvas.height;
      } else {
        // Top or bottom edge
        x = Math.random() * this.canvas.width;
        y = Math.random() < 0.5 ? Math.random() * margin : this.canvas.height - Math.random() * margin;
      }

      this.stars.push({
        x: x,
        y: y,
        radius: Math.random() * 1.5,
        opacity: Math.random() * 0.5 + 0.3,
        twinkleSpeed: Math.random() * 0.02 + 0.01,
      });
    }

    this.shootingStars = [];
    this.createShootingStar();
    this.createMeteorShower();

    this.animateParticlesWithAnime();
  }

  createPlanets(count, orbitRadius) {
    const planets = [];
    for (let i = 0; i < count; i++) {
      planets.push({
        angle: ((Math.PI * 2) / count) * i,
        size: Math.random() * 4 + 3,
        color: this.getRandomColor(),
      });
    }
    return planets;
  }

  getRandomColor() {
    const grays = [
      "#333333",
      "#555555",
      "#777777",
      "#999999",
      "#aaaaaa",
      "#cccccc",
    ];
    return grays[Math.floor(Math.random() * grays.length)];
  }

  animateParticlesWithAnime() {
    this.particles.forEach((particle, index) => {
      anime({
        targets: particle,
        opacity: [particle.opacity, Math.random() * 0.5 + 0.2],
        radius: [particle.radius, particle.radius + Math.random() * 2],
        duration: 2000 + Math.random() * 2000,
        easing: "easeInOutSine",
        loop: true,
        direction: "alternate",
        delay: index * 50,
      });
    });
  }

  updateTheme(isDark) {
    this.isDark = isDark;
  }

  drawOrbit(orbit) {
    this.ctx.beginPath();
    this.ctx.arc(this.centerX, this.centerY, orbit.radius, 0, Math.PI * 2);
    this.ctx.strokeStyle = this.isDark
      ? "rgba(255, 255, 255, 0.25)"
      : "rgba(7, 7, 7, 0.25)";
    this.ctx.lineWidth = 1.5;
    this.ctx.stroke();

    const gradient = this.ctx.createRadialGradient(
      this.centerX,
      this.centerY,
      orbit.radius - 15,
      this.centerX,
      this.centerY,
      orbit.radius + 15,
    );

    if (this.isDark) {
      gradient.addColorStop(0, "rgba(255, 255, 255, 0.15)");
      gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
    } else {
      gradient.addColorStop(0, "rgba(7, 7, 7, 0.15)");
      gradient.addColorStop(1, "rgba(7, 7, 7, 0)");
    }

    this.ctx.beginPath();
    this.ctx.arc(this.centerX, this.centerY, orbit.radius, 0, Math.PI * 2);
    this.ctx.strokeStyle = gradient;
    this.ctx.lineWidth = 3;
    this.ctx.stroke();
  }

  drawPlanet(planet, orbit) {
    const x =
      this.centerX + Math.cos(planet.angle + orbit.angle) * orbit.radius;
    const y =
      this.centerY + Math.sin(planet.angle + orbit.angle) * orbit.radius;

    const pulse = 1 + Math.sin(Date.now() * 0.002 + planet.angle) * 0.15;
    const glowSize = planet.size * 3 * pulse;

    const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, glowSize);
    gradient.addColorStop(0, planet.color);
    gradient.addColorStop(0.5, planet.color + "80");
    gradient.addColorStop(1, "transparent");

    this.ctx.beginPath();
    this.ctx.arc(x, y, glowSize, 0, Math.PI * 2);
    this.ctx.fillStyle = gradient;
    this.ctx.fill();

    this.ctx.beginPath();
    this.ctx.arc(x, y, planet.size * pulse, 0, Math.PI * 2);
    this.ctx.fillStyle = planet.color;
    this.ctx.shadowBlur = 10;
    this.ctx.shadowColor = planet.color;
    this.ctx.fill();
    this.ctx.shadowBlur = 0;

    const highlightGradient = this.ctx.createRadialGradient(
      x - planet.size * 0.3,
      y - planet.size * 0.3,
      0,
      x,
      y,
      planet.size * pulse,
    );
    highlightGradient.addColorStop(0, "rgba(255, 255, 255, 0.4)");
    highlightGradient.addColorStop(1, "transparent");

    this.ctx.beginPath();
    this.ctx.arc(x, y, planet.size * pulse, 0, Math.PI * 2);
    this.ctx.fillStyle = highlightGradient;
    this.ctx.fill();
  }

  drawParticle(particle) {
    const gradient = this.ctx.createRadialGradient(
      particle.x,
      particle.y,
      0,
      particle.x,
      particle.y,
      particle.radius * 2,
    );

    const color = this.isDark ? "223, 233, 255" : "7, 7, 7";
    gradient.addColorStop(0, `rgba(${color}, ${particle.opacity})`);
    gradient.addColorStop(1, "transparent");

    this.ctx.beginPath();
    this.ctx.arc(particle.x, particle.y, particle.radius * 2, 0, Math.PI * 2);
    this.ctx.fillStyle = gradient;
    this.ctx.fill();
  }

  createShootingStar() {
    const delay = 5000 + Math.random() * 10000;

    setTimeout(() => {
      const startX = Math.random() * this.canvas.width;
      const startY = -50;

      this.shootingStars.push({
        x: startX,
        y: startY,
        vx: (Math.random() - 0.5) * 4,
        vy: Math.random() * 3 + 3,
        length: 15 + Math.random() * 15, // Regular tails 15-30
        opacity: 1,
        lifetime: 0,
        maxLifetime: 100
      });

      this.createShootingStar();
    }, delay);
  }

  createMeteorShower() {
    const delay = 60000 + Math.random() * 60000; // 1-2 minutes

    setTimeout(() => {
      const count = 8 + Math.floor(Math.random() * 7); // 8-15 stars

      for (let i = 0; i < count; i++) {
        setTimeout(() => {
          const startX = this.canvas.width - 50 + Math.random() * 100;
          const startY = -100 + Math.random() * 200;

          this.shootingStars.push({
            x: startX,
            y: startY,
            vx: -8 - Math.random() * 4,
            vy: 6 + Math.random() * 3,
            length: 25 + Math.random() * 20, // Big tails 25-45
            opacity: 1,
            lifetime: 0,
            maxLifetime: 120
          });
        }, i * 50);
      }

      this.createMeteorShower();
    }, delay);
  }

  drawShootingStar(star) {
    star.x += star.vx;
    star.y += star.vy;
    star.lifetime++;

    star.opacity = 1 - (star.lifetime / star.maxLifetime);

    if (star.opacity <= 0) return false;

    const tailLength = star.length || 20;

    const gradient = this.ctx.createLinearGradient(
      star.x,
      star.y,
      star.x - star.vx * tailLength,
      star.y - star.vy * tailLength
    );

    const color = this.isDark ? '255, 255, 255' : '200, 200, 200';
    gradient.addColorStop(0, `rgba(${color}, ${star.opacity * 0.9})`);
    gradient.addColorStop(0.3, `rgba(${color}, ${star.opacity * 0.6})`);
    gradient.addColorStop(1, `rgba(${color}, 0)`);

    this.ctx.beginPath();
    this.ctx.moveTo(star.x, star.y);
    this.ctx.lineTo(star.x - star.vx * tailLength, star.y - star.vy * tailLength);
    this.ctx.strokeStyle = gradient;
    this.ctx.lineWidth = 3;
    this.ctx.stroke();

    // Glow around the star head
    const glowGradient = this.ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, 8);
    glowGradient.addColorStop(0, `rgba(${color}, ${star.opacity})`);
    glowGradient.addColorStop(1, `rgba(${color}, 0)`);

    this.ctx.beginPath();
    this.ctx.arc(star.x, star.y, 8, 0, Math.PI * 2);
    this.ctx.fillStyle = glowGradient;
    this.ctx.fill();

    // Star head
    this.ctx.beginPath();
    this.ctx.arc(star.x, star.y, 2.5, 0, Math.PI * 2);
    this.ctx.fillStyle = `rgba(${color}, ${star.opacity})`;
    this.ctx.fill();

    return true;
  }

  drawStar(star) {
    star.opacity += Math.sin(Date.now() * star.twinkleSpeed) * 0.01;
    star.opacity = Math.max(0.1, Math.min(0.8, star.opacity));

    this.ctx.beginPath();
    this.ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    this.ctx.fillStyle = this.isDark
      ? `rgba(255, 255, 255, ${star.opacity})`
      : `rgba(150, 150, 150, ${star.opacity * 0.5})`;
    this.ctx.fill();
  }

  drawConnections() {
    if (isMobile) return;

    const maxDistance = 150;
    const maxDistanceSquared = maxDistance * maxDistance;

    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const distanceSquared = dx * dx + dy * dy;

        // Use squared distance to avoid sqrt until necessary
        if (distanceSquared < maxDistanceSquared) {
          const distance = Math.sqrt(distanceSquared);
          const opacity = (1 - distance / maxDistance) * 0.2;
          this.ctx.beginPath();
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          this.ctx.strokeStyle = this.isDark
            ? `rgba(255, 255, 255, ${opacity})`
            : `rgba(7, 7, 7, ${opacity})`;
          this.ctx.lineWidth = 1;
          this.ctx.stroke();
        }
      }
    }
  }

  animate() {
    if (!this.isVisible) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (this.stars) {
      this.stars.forEach((star) => this.drawStar(star));
    }

    if (this.shootingStars) {
      this.shootingStars = this.shootingStars.filter(star => this.drawShootingStar(star));
    }

    this.orbits.forEach((orbit) => {
      this.drawOrbit(orbit);

      orbit.planets.forEach((planet) => {
        this.drawPlanet(planet, orbit);
      });

      orbit.angle += orbit.speed;
    });

    this.drawConnections();

    this.particles.forEach((particle) => {
      if (!isMobile) {
        const dx = particle.x - this.mouse.x;
        const dy = particle.y - this.mouse.y;
        const distanceSquared = dx * dx + dy * dy;
        const minDistance = 100;
        const minDistanceSquared = minDistance * minDistance;

        if (distanceSquared < minDistanceSquared) {
          const distance = Math.sqrt(distanceSquared);
          const force = (minDistance - distance) / minDistance;
          particle.x += (dx / distance) * force * 2;
          particle.y += (dy / distance) * force * 2;
        }
      }

      particle.x += particle.vx;
      particle.y += particle.vy;

      if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
      if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;

      this.drawParticle(particle);
    });

    this.animationId = requestAnimationFrame(() => this.animate());
  }
}

function animateProjectsSection() {
  const projectCards = document.querySelectorAll(".project-card");

  anime({
    targets: projectCards,
    opacity: [0, 1],
    translateY: [20, 0],
    duration: 600,
    easing: "easeOutCubic",
    delay: anime.stagger(100)
  });
}

function animateStackSection() {
  const categories = document.querySelectorAll("#stack .category");
  const stackBlocks = document.querySelectorAll("#stack .stack_block");
  stackBlocks.forEach((block) => {
    if (!block.querySelector(".experience-bar")) {
      const expText = block.querySelector(".stack_yo_exp").textContent;
      const years = parseFloat(expText);
      const percentage = Math.min((years / 5) * 100, 100);

      const barContainer = document.createElement("div");
      barContainer.className = "experience-bar";
      const barFill = document.createElement("div");
      barFill.className = "experience-fill";
      barFill.dataset.width = percentage;
      barContainer.appendChild(barFill);

      block.querySelector(".stack_content").appendChild(barContainer);

      if (document.body.classList.contains("dark")) {
        block.classList.add("dark");
      }
    }
  });

  anime({
    targets: categories,
    opacity: [0, 1],
    translateY: [30, 0],
    delay: anime.stagger(200),
    duration: 800,
    easing: "easeOutCubic",
  });

  anime({
    targets: stackBlocks,
    opacity: [0, 1],
    scale: [0.8, 1],
    translateY: [20, 0],
    delay: anime.stagger(80, { start: 300 }),
    duration: 600,
    easing: "easeOutElastic(1, .8)",
    complete: () => {
      stackBlocks.forEach((block) => {
        const fill = block.querySelector(".experience-fill");
        if (fill) {
          setTimeout(() => {
            fill.style.width = fill.dataset.width + "%";
          }, 100);
        }
      });
    },
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".sidebar-btn, .sidebar-logo-btn, .sidebar-theme-btn");
  const frames = document.querySelectorAll(".scroll-section");
  const cards = document.querySelectorAll(".card");
  const body = document.body;
  const welcomeText1 = document.querySelector("#welcome-text-1");
  const welcomeText2 = document.querySelector("#welcome-text-2");
  const arrows = document.querySelectorAll(
    ".swiper-button-prev, .swiper-button-next",
  );
  const themeButton = document.querySelector(".theme-icon");
  const themeButtonDark = document.querySelector(".theme-icon-dark");
  const themeSecondary = document.querySelectorAll(".theme-secondary");
  const githubLink = document.querySelector(".github-link");

  let typingTimeout = null;
  let isTyping = false;

  const bgAnimation = new BackgroundAnimation();

  // ===== BUBBLE NAV INDICATOR =====
  const sidebarNav = document.querySelector(".sidebar-nav");
  const bubbleIndicator = document.createElement("div");
  bubbleIndicator.className = "bubble-indicator";
  sidebarNav.appendChild(bubbleIndicator);

  function updateBubble(activeBtn) {
    if (!activeBtn || !sidebarNav) return;
    const navRect = sidebarNav.getBoundingClientRect();
    const btnRect = activeBtn.getBoundingClientRect();
    bubbleIndicator.style.top = (btnRect.top - navRect.top) + "px";
    bubbleIndicator.style.height = btnRect.height + "px";
  }

  // Position bubble on initial active button
  const initialActive = sidebarNav.querySelector(".sidebar-btn.active");
  if (initialActive) {
    // No transition on first position
    bubbleIndicator.style.transition = "none";
    updateBubble(initialActive);
    // Re-enable transition after layout
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        bubbleIndicator.style.transition = "";
      });
    });
  }

  // Reposition bubble on resize
  window.addEventListener("resize", () => {
    const currentActive = sidebarNav.querySelector(".sidebar-btn.active");
    if (currentActive) {
      bubbleIndicator.style.transition = "none";
      updateBubble(currentActive);
      requestAnimationFrame(() => {
        bubbleIndicator.style.transition = "";
      });
    }
  }, { passive: true });

  // Simple lamp swinging animation (no mouse tracking)
  const lampButton = document.getElementById("light-dark-btn");
  let lampAngle = 0;
  let lampVelocity = 0;
  const lampDamping = 0.94;
  const lampStiffness = 0.06;
  const lampNaturalSwing = 0.08; // Increased swing amplitude

  function updateLampSwing() {
    if (!lampButton) return;

    // Add sine wave force to create natural swinging
    const time = Date.now() * 0.001;
    const swingForce = Math.sin(time * 1.2) * lampNaturalSwing;

    lampVelocity += swingForce;
    lampVelocity += -lampAngle * lampStiffness;
    lampVelocity *= lampDamping;
    lampAngle += lampVelocity;

    const activeLamp = body.classList.contains("dark")
      ? lampButton.querySelector(".theme-icon-dark")
      : lampButton.querySelector(".theme-icon");

    if (activeLamp) {
      activeLamp.style.transform = `rotate(${lampAngle}deg)`;
    }

    requestAnimationFrame(updateLampSwing);
  }

  if (!isMobile) {
    updateLampSwing();
  }

  // ===== LIQUID GLASS INTERACTIONS (desktop only) =====
  if (!isMobile) {
    const sidebarButtons = document.querySelectorAll(".sidebar-btn");

    // Helper: random organic-rectangular border-radius (subtle variation, not circular)
    function randomBlobRadius() {
      const vals = [];
      for (let i = 0; i < 4; i++) {
        vals.push(Math.floor(8 + Math.random() * 12) + "px");
      }
      return vals[0] + " " + vals[1] + " " + vals[2] + " " + vals[3];
    }

    // Liquid ripple + hover morph for sidebar buttons
    sidebarButtons.forEach((btn) => {
      // Liquid ripple on click
      btn.addEventListener("click", (e) => {
        const ripple = document.createElement("div");
        ripple.className = "lg-ripple";
        const rect = btn.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height) * 1.5;
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.width = size + "px";
        ripple.style.height = size + "px";
        ripple.style.left = x + "px";
        ripple.style.top = y + "px";

        btn.appendChild(ripple);
        ripple.addEventListener("animationend", () => ripple.remove());
      });

      // Hover morph — random blob shape
      btn.addEventListener("mouseenter", () => {
        btn.style.borderRadius = randomBlobRadius();
      });
      btn.addEventListener("mouseleave", () => {
        btn.style.borderRadius = "";
      });
    });

    // Hover morph for stack cards
    const allStackBlocks = document.querySelectorAll("#stack .stack_block");
    allStackBlocks.forEach((block) => {
      block.addEventListener("mouseenter", () => {
        block.style.borderRadius = randomBlobRadius();
      });
      block.addEventListener("mouseleave", () => {
        block.style.borderRadius = "";
      });
    });

    // Hover morph for contact links
    const contactLinks = document.querySelectorAll(".contact-link");
    contactLinks.forEach((link) => {
      link.addEventListener("mouseenter", () => {
        link.style.borderRadius = randomBlobRadius();
      });
      link.addEventListener("mouseleave", () => {
        link.style.borderRadius = "";
      });
    });
  }

  function toggleDarkTheme() {
    const isDark = !body.classList.contains("dark"); // Will be the NEW state after toggle
    body.classList.toggle("dark");

    const allButtons = document.querySelectorAll(".btn, .sidebar-btn");
    allButtons.forEach((btn) => btn.classList.toggle("dark"));

    arrows.forEach((arrow) => arrow.classList.toggle("dark"));
    themeSecondary.forEach((el) => el.classList.toggle("dark"));

    // FORCE update project cards
    const projectCards = document.querySelectorAll(".project-card");
    projectCards.forEach((card) => {
      if (isDark && !card.classList.contains("dark")) {
        card.classList.add("dark");
      } else if (!isDark && card.classList.contains("dark")) {
        card.classList.remove("dark");
      }
    });

    const stackCategories = document.querySelectorAll("#stack .category");
    const stackBlocks = document.querySelectorAll("#stack .stack_block");
    stackCategories.forEach((cat) => cat.classList.toggle("dark"));
    stackBlocks.forEach((block) => block.classList.toggle("dark"));

    themeButton.classList.toggle("dark");
    themeButtonDark.classList.toggle("dark");
    bgAnimation.updateTheme(body.classList.contains("dark"));

    // Update glass cursor
    const cursorEl = document.getElementById("circle");
    if (cursorEl) {
      if (isDark) {
        cursorEl.style.width = "1.2rem";
        cursorEl.style.height = "1.2rem";
        cursorEl.style.background = "radial-gradient(circle, rgba(180, 200, 255, 0.35), rgba(180, 200, 255, 0.1))";
        cursorEl.style.opacity = "0.6";
        cursorEl.style.border = "1px solid rgba(255, 255, 255, 0.15)";
        cursorEl.style.boxShadow = "0 0 8px rgba(150, 180, 255, 0.2)";
      } else {
        cursorEl.style.width = "1rem";
        cursorEl.style.height = "1rem";
        cursorEl.style.background = "#555";
        cursorEl.style.opacity = "0.4";
        cursorEl.style.border = "none";
        cursorEl.style.boxShadow = "none";
      }
    }

    // FORCE update sidebar buttons
    const sidebarButtons = document.querySelectorAll(".sidebar-btn");
    sidebarButtons.forEach((btn) => {
      if (isDark && !btn.classList.contains("dark")) {
        btn.classList.add("dark");
      } else if (!isDark && btn.classList.contains("dark")) {
        btn.classList.remove("dark");
      }
    });
  }
  let theme =
    localStorage.getItem("theme") ||
    (window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "default");
  if (theme === "dark") {
    toggleDarkTheme();
  } else {
    bgAnimation.updateTheme(false);
  }

  setTimeout(() => {
    const sidebarButtons = document.querySelectorAll(".sidebar-btn");
    if (body.classList.contains("dark")) {
      sidebarButtons.forEach((btn) => {
        if (!btn.classList.contains("dark")) {
          btn.classList.add("dark");
        }
      });
    }
  }, 100);

  // Following circle cursor (desktop only)
  if (!isMobile) {
    const circle = document.createElement("div");
    const isDarkNow = body.classList.contains("dark");
    Object.assign(circle.style, {
      position: "fixed",
      width: isDarkNow ? "1.2rem" : "1rem",
      height: isDarkNow ? "1.2rem" : "1rem",
      background: isDarkNow
        ? "radial-gradient(circle, rgba(180, 200, 255, 0.35), rgba(180, 200, 255, 0.1))"
        : "#555",
      borderRadius: "50%",
      pointerEvents: "none",
      zIndex: "1000",
      transform: "translate(-50%, -50%)",
      opacity: isDarkNow ? "0.6" : "0.4",
      border: isDarkNow ? "1px solid rgba(255, 255, 255, 0.15)" : "none",
      boxShadow: isDarkNow ? "0 0 8px rgba(150, 180, 255, 0.2)" : "none",
      transition: "opacity 0.3s ease, width 0.3s ease, height 0.3s ease, background 0.3s ease, border 0.3s ease, box-shadow 0.3s ease",
    });
    circle.id = "circle";
    document.body.appendChild(circle);
    let mouseX = 0,
      mouseY = 0;
    let circleX = 0,
      circleY = 0;
    const circleSpeed = 0.02;

    document.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }, { passive: true });

    function animateCircle() {
      circleX += (mouseX + 10 - circleX) * circleSpeed;
      circleY += (mouseY - 50 - circleY) * circleSpeed;
      circle.style.transform = `translate(${circleX}px, ${circleY}px)`;
      requestAnimationFrame(animateCircle);
    }
    animateCircle();
  }

  function playWelcomeAnimation() {
    welcomeText1.classList.remove("hidden");
    welcomeText2.classList.add("hidden");
    welcomeText1.style.animation = "none";
    welcomeText2.style.animation = "none";

    setTimeout(() => {
      welcomeText1.style.animation = "fadeOutAndUp 1.5s forwards";
      setTimeout(() => {
        welcomeText1.classList.add("hidden");
        welcomeText2.classList.remove("hidden");
        welcomeText2.style.animation = "fadeIn 0.5s forwards";
      }, 500);
    }, 1500);
  }

  function enableCardTilt(cards) {
    if (!window.matchMedia("(pointer: coarse)").matches) {
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
            card.style.transform =
              "perspective(1000px) rotateX(0) rotateY(0) scale(1)";
            card.style.boxShadow = "0 4px 20px rgba(0,0,0,0.1)";
          });
        });
      });
    }
  }

  enableCardTilt(cards);

  const stackBlocks = document.querySelectorAll("#stack .stack_block");
  enableCardTilt(stackBlocks);

  function stopTyping() {
    isTyping = false;
    if (typingTimeout) clearTimeout(typingTimeout);
  }

  function typeWriter(elementId, text, speed = 50) {
    stopTyping();
    const el = document.getElementById(elementId);
    if (!el) return;

    el.innerHTML = "";
    let index = 0;
    isTyping = true;

    function type() {
      if (index < text.length && isTyping) {
        const char = text[index];
        el.innerHTML = el.innerHTML.replace('<span class="typing-cursor"></span>', '');
        el.innerHTML += char === "\n" ? "<br>" : char;
        el.innerHTML += '<span class="typing-cursor"></span>';
        index++;
        typingTimeout = setTimeout(type, speed);
      } else if (isTyping) {
        setTimeout(() => {
          if (el.querySelector('.typing-cursor')) {
            el.querySelector('.typing-cursor').remove();
          }
        }, 2000);
      }
    }
    type();
  }

  setTimeout(playWelcomeAnimation, 1500);

  const sectionOrder = ["welcome", "about-me", "stack", "projects"];
  const scrollContainer = document.querySelector(".horizontal-scroll-container");
  let currentSectionIndex = 1; // Start at about-me

  // Sidebar button clicks
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetId = button.getAttribute("data-target");
      const targetSection = document.getElementById(targetId);

      if (targetId === "theme") {
        localStorage.setItem(
          "theme",
          document.body.classList.contains("dark") ? "default" : "dark",
        );
        toggleDarkTheme();
        return;
      }

      if (targetSection) {
        // On mobile: show/hide sections instead of scrolling
        if (isMobile) {
          frames.forEach((frame) => frame.classList.remove("active"));
          targetSection.classList.add("active");
        } else {
          // Desktop: Smooth scroll to target section
          targetSection.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'start' });
        }

        // Update active button
        buttons.forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");

        // Move bubble indicator
        if (button.classList.contains("sidebar-btn")) {
          updateBubble(button);
        }

        // Update current index
        currentSectionIndex = sectionOrder.indexOf(targetId);

        // Trigger animations based on section
        switch (targetId) {
          case "welcome":
            playWelcomeAnimation();
            break;

          case "about-me":
            typeWriter(
              "typing-text",
              "My name is Artur.\nI`m the best one.",
              50,
            );
            break;

          case "stack":
            animateStackSection();
            break;

          case "projects":
            animateProjectsSection();

            new Swiper(".swiper", {
              effect: "cards",
              grabCursor: true,
              cardsEffect: {
                perSlideOffset: 5,
                perSlideRotate: 1,
                rotate: true,
                slideShadows: false,
              },
              loop: true,
              navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
              },
              speed: 400,
            });

            const cards = document.querySelectorAll(".project-card");
            if (body.classList.contains("dark")) {
              cards.forEach((card) => card.classList.add("dark"));
            }
            break;
        }
      }
    });
  });

  // Trigger section animations
  function triggerSectionAnimation(sectionId) {
    switch (sectionId) {
      case "welcome":
        playWelcomeAnimation();
        break;
      case "about-me":
        typeWriter("typing-text", "My name is Artur.\nI`m the best one.", 50);
        break;
      case "stack":
        animateStackSection();
        break;
      case "projects":
        animateProjectsSection();
        new Swiper(".swiper", {
          effect: "cards",
          grabCursor: true,
          cardsEffect: {
            perSlideOffset: 5,
            perSlideRotate: 1,
            rotate: true,
            slideShadows: false,
          },
          loop: true,
          navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          },
          speed: 400,
        });
        const cards = document.querySelectorAll(".project-card");
        if (body.classList.contains("dark")) {
          cards.forEach((card) => card.classList.add("dark"));
        }
        break;
    }
  }

  // Detect scroll position and update active button + trigger animations (desktop only)
  if (scrollContainer && !isMobile) {
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
          if (targetButton.classList.contains("sidebar-btn")) {
            updateBubble(targetButton);
          }
        }

        // Trigger animation for the new section
        triggerSectionAnimation(currentSection);
      }
    }, { passive: true });
  }
});
