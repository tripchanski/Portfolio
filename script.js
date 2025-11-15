class BackgroundAnimation {
  constructor() {
    this.canvas = document.getElementById("background-canvas");
    this.ctx = this.canvas.getContext("2d");
    this.orbits = [];
    this.particles = [];
    this.isDark = false;
    this.mouse = { x: 0, y: 0 };

    this.resize();
    let resizeTimeout;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => this.resize(), 150);
    });

    // Track mouse for interactive effects
    window.addEventListener("mousemove", (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
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
    const orbitCount = 5;
    for (let i = 0; i < orbitCount; i++) {
      const radius = 100 + i * 80;
      const speed = 0.0005 + i * 0.0003;
      const planetCount = 2 + i;

      this.orbits.push({
        radius,
        speed,
        angle: Math.random() * Math.PI * 2,
        planets: this.createPlanets(planetCount, radius),
      });
    }

    for (let i = 0; i < 50; i++) {
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
    for (let i = 0; i < 100; i++) {
      this.stars.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        radius: Math.random() * 1.5,
        opacity: Math.random() * 0.5 + 0.3,
        twinkleSpeed: Math.random() * 0.02 + 0.01,
      });
    }

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
    const maxDistance = 150;
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < maxDistance) {
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
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (this.stars) {
      this.stars.forEach((star) => this.drawStar(star));
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
      const dx = particle.x - this.mouse.x;
      const dy = particle.y - this.mouse.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const minDistance = 100;

      if (distance < minDistance) {
        const force = (minDistance - distance) / minDistance;
        particle.x += (dx / distance) * force * 2;
        particle.y += (dy / distance) * force * 2;
      }

      particle.x += particle.vx;
      particle.y += particle.vy;

      if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
      if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;

      this.drawParticle(particle);
    });

    requestAnimationFrame(() => this.animate());
  }
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
  const buttons = document.querySelectorAll(".btn");
  const frames = document.querySelectorAll(".frame");
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

  function toggleDarkTheme() {
    const isDark = !body.classList.contains("dark"); // Will be the NEW state after toggle
    body.classList.toggle("dark");

    const allButtons = document.querySelectorAll(".btn");
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
    if (githubLink) githubLink.classList.toggle("dark");
    bgAnimation.updateTheme(body.classList.contains("dark"));

    // FORCE update footer buttons
    const footerButtons = document.querySelectorAll("footer .btn");
    footerButtons.forEach((btn) => {
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
    const footerButtons = document.querySelectorAll("footer .btn");
    if (body.classList.contains("dark")) {
      footerButtons.forEach((btn) => {
        if (!btn.classList.contains("dark")) {
          btn.classList.add("dark");
        }
      });
    }
  }, 100);

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
  let mouseX = 0,
    mouseY = 0;
  let circleX = 0,
    circleY = 0;
  const circleSpeed = 0.02;

  document.addEventListener(
    "mousemove",
    throttle((e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }, 16),
  );

  function animateCircle() {
    circleX += (mouseX + 10 - circleX) * circleSpeed;
    circleY += (mouseY - 50 - circleY) * circleSpeed;
    circle.style.transform = `translate(${circleX}px, ${circleY}px)`;
    requestAnimationFrame(animateCircle);
  }
  animateCircle();

  function throttle(func, limit) {
    let lastFunc, lastRan;
    return function (...args) {
      if (!lastRan) {
        func.apply(this, args);
        lastRan = Date.now();
      } else {
        clearTimeout(lastFunc);
        lastFunc = setTimeout(
          () => {
            if (Date.now() - lastRan >= limit) {
              func.apply(this, args);
              lastRan = Date.now();
            }
          },
          limit - (Date.now() - lastRan),
        );
      }
    };
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
        el.innerHTML += text[index] === "\n" ? "<br>" : text[index];
        index++;
        typingTimeout = setTimeout(type, speed);
      }
    }
    type();
  }

  setTimeout(playWelcomeAnimation, 1500);

  const frameOrder = ["welcome", "about-me", "stack", "projects"];
  let currentFrameIndex = 0;

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetId = button.getAttribute("data-target");
      const targetFrame = document.getElementById(targetId);
      const targetBtnFrame = document.getElementById(button.getAttribute("id"));

      if (targetId === "theme") {
        localStorage.setItem(
          "theme",
          document.body.classList.contains("dark") ? "default" : "dark",
        );
        toggleDarkTheme();
        return;
      }

      const targetIndex = frameOrder.indexOf(targetId);
      const currentFrame = frames[currentFrameIndex];
      const direction = targetIndex > currentFrameIndex ? "left" : "right";

      if (currentFrame) {
        currentFrame.classList.remove("active");
        currentFrame.classList.add(
          direction === "left" ? "slide-out-left" : "slide-out-right",
        );

        setTimeout(() => {
          currentFrame.classList.remove("slide-out-left", "slide-out-right");
        }, 500);
      }

      targetFrame.classList.add(
        direction === "left" ? "slide-in-right" : "slide-in-left",
      );

      setTimeout(() => {
        targetFrame.classList.remove("slide-in-left", "slide-in-right");
        targetFrame.classList.add("active");
      }, 10);

      buttons.forEach((btn) => btn.classList.remove("active"));
      targetBtnFrame.classList.add("active");

      currentFrameIndex = targetIndex;

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
    });
  });
});
