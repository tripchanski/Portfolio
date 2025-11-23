class BackgroundAnimation {
  constructor() {
    this.canvas = document.getElementById("background-canvas");
    this.ctx = this.canvas.getContext("2d");
    this.snowCanvas = document.getElementById("snow-canvas");
    this.snowCtx = this.snowCanvas.getContext("2d");
    this.orbits = [];
    this.particles = [];
    this.snowflakes = [];
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
    this.snowCanvas.width = window.innerWidth;
    this.snowCanvas.height = window.innerHeight;
    this.centerX = this.canvas.width / 2;
    this.centerY = this.canvas.height / 2;
  }

  init() {
    // Detect mobile for performance optimization
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    const orbitCount = isMobile ? 3 : 5;
    for (let i = 0; i < orbitCount; i++) {
      const radius = 100 + i * 80;
      const speed = 0.0005 + i * 0.0003;
      const planetCount = isMobile ? 2 : 2 + i;

      this.orbits.push({
        radius,
        speed,
        angle: Math.random() * Math.PI * 2,
        planets: this.createPlanets(planetCount, radius),
      });
    }

    const particleCount = isMobile ? 15 : 30;
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
    const starCount = isMobile ? 20 : 35;
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

    // Create snowflakes for New Year atmosphere
    const snowflakeCount = isMobile ? 40 : 80;
    for (let i = 0; i < snowflakeCount; i++) {
      this.snowflakes.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        radius: Math.random() * 2.5 + 1,
        speed: Math.random() * 1 + 0.5,
        wind: Math.random() * 0.5 - 0.25,
        opacity: Math.random() * 0.6 + 0.4,
        swing: Math.random() * Math.PI * 2,
        swingSpeed: Math.random() * 0.02 + 0.01
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

  drawSnowflake(snowflake) {
    // Update position
    snowflake.y += snowflake.speed;
    snowflake.swing += snowflake.swingSpeed;
    snowflake.x += Math.sin(snowflake.swing) * 0.5 + snowflake.wind;

    // Reset if off screen
    if (snowflake.y > this.canvas.height) {
      snowflake.y = -10;
      snowflake.x = Math.random() * this.canvas.width;
    }
    if (snowflake.x > this.canvas.width) {
      snowflake.x = 0;
    } else if (snowflake.x < 0) {
      snowflake.x = this.canvas.width;
    }

    // Draw snowflake with gradient for depth on snow canvas
    // Black on light theme, white on dark theme
    const snowColor = this.isDark ? '255, 255, 255' : '0, 0, 0';

    const gradient = this.snowCtx.createRadialGradient(
      snowflake.x,
      snowflake.y,
      0,
      snowflake.x,
      snowflake.y,
      snowflake.radius * 2
    );

    gradient.addColorStop(0, `rgba(${snowColor}, ${snowflake.opacity})`);
    gradient.addColorStop(1, `rgba(${snowColor}, 0)`);

    this.snowCtx.beginPath();
    this.snowCtx.arc(snowflake.x, snowflake.y, snowflake.radius * 2, 0, Math.PI * 2);
    this.snowCtx.fillStyle = gradient;
    this.snowCtx.fill();

    // Draw solid center
    this.snowCtx.beginPath();
    this.snowCtx.arc(snowflake.x, snowflake.y, snowflake.radius, 0, Math.PI * 2);
    this.snowCtx.fillStyle = `rgba(${snowColor}, ${snowflake.opacity * 0.9})`;
    this.snowCtx.fill();
  }

  drawConnections() {
    // Skip connections on mobile for performance
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile) return;

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
    this.snowCtx.clearRect(0, 0, this.snowCanvas.width, this.snowCanvas.height);

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

    // Draw snowflakes on separate canvas (foreground with high z-index)
    if (this.snowflakes) {
      this.snowflakes.forEach((snowflake) => this.drawSnowflake(snowflake));
    }

    requestAnimationFrame(() => this.animate());
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

  // Mini-game: Catch the shapes
  let gameScore = 0;
  const gameCounter = document.getElementById("game-counter");
  const shapes = ["star", "circle", "triangle"];

  function createCatchShape() {
    const shape = document.createElement("div");
    shape.className = `catch-shape ${shapes[Math.floor(Math.random() * shapes.length)]}`;

    const edge = Math.floor(Math.random() * 4);
    const margin = 30;
    const size = 35;

    let startX, startY;
    switch (edge) {
      case 0: // Top
        startX = Math.random() * (window.innerWidth - size);
        startY = margin;
        break;
      case 1: // Right
        startX = window.innerWidth - margin - size;
        startY = Math.random() * (window.innerHeight - size);
        break;
      case 2: // Bottom
        startX = Math.random() * (window.innerWidth - size);
        startY = window.innerHeight - margin - size;
        break;
      case 3: // Left
        startX = margin;
        startY = Math.random() * (window.innerHeight - size);
        break;
    }

    shape.style.left = `${startX}px`;
    shape.style.top = `${startY}px`;

    // Cosmic debris floating animation - drift along edges only
    let driftX, driftY;

    // Drift parallel to the edge, not towards center
    switch (edge) {
      case 0: // Top - drift left/right
        driftX = (Math.random() - 0.5) * 200;
        driftY = Math.random() * 50; // slight downward only
        break;
      case 1: // Right - drift up/down
        driftX = -Math.random() * 50; // slight leftward only
        driftY = (Math.random() - 0.5) * 200;
        break;
      case 2: // Bottom - drift left/right
        driftX = (Math.random() - 0.5) * 200;
        driftY = -Math.random() * 50; // slight upward only
        break;
      case 3: // Left - drift up/down
        driftX = Math.random() * 50; // slight rightward only
        driftY = (Math.random() - 0.5) * 200;
        break;
    }

    const rotation = Math.random() * 360;
    const duration = 10000 + Math.random() * 5000;

    shape.addEventListener("click", (e) => {
      e.stopPropagation();
      gameScore++;

      // Show counter on first catch
      if (gameScore === 1) {
        gameCounter.classList.add("visible");
      }

      gameCounter.textContent = `⭐ ${gameScore}`;
      gameCounter.classList.add("pulse");
      setTimeout(() => gameCounter.classList.remove("pulse"), 300);

      anime.remove(shape);
      anime({
        targets: shape,
        scale: [1, 0],
        rotate: `+=${rotation * 2}`,
        opacity: [0.7, 0],
        duration: 300,
        easing: "easeInQuad",
        complete: () => shape.remove()
      });
    });

    document.body.appendChild(shape);

    anime({
      targets: shape,
      translateX: [0, driftX],
      translateY: [0, driftY],
      rotate: [0, rotation],
      opacity: [0, 0.7],
      duration: duration,
      easing: "linear",
      complete: () => {
        if (shape.parentElement) {
          anime({
            targets: shape,
            opacity: [0.7, 0],
            duration: 500,
            easing: "easeOutQuad",
            complete: () => shape.remove()
          });
        }
      }
    });
  }

  function startShapeSpawner() {
    // Reduce spawn rate on mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const minDelay = isMobile ? 6000 : 4000;
    const maxDelay = isMobile ? 10000 : 6000;

    const spawn = () => {
      createCatchShape();
      setTimeout(spawn, minDelay + Math.random() * maxDelay);
    };
    setTimeout(spawn, 2000);
  }

  startShapeSpawner();

  // Sudoku Easter Egg
  const sudokuModal = document.getElementById("sudoku-modal");
  const sudokuGrid = document.getElementById("sudoku-grid");
  const sudokuClose = document.getElementById("sudoku-close");
  const sudokuCheck = document.getElementById("sudoku-check");
  const sudokuNew = document.getElementById("sudoku-new");
  const yearTrigger = document.getElementById("year-trigger");
  const sudokuMessage = document.getElementById("sudoku-message");
  const sudokuTimer = document.getElementById("sudoku-timer");

  let sudokuPuzzle = [];
  let sudokuSolution = [];
  let victoryStars = [];
  let timerInterval = null;
  let startTime = null;
  let elapsedTime = 0;

  // Simple Sudoku generator
  function generateSudoku() {
    // Base solved puzzle
    const base = [
      [5,3,4,6,7,8,9,1,2],
      [6,7,2,1,9,5,3,4,8],
      [1,9,8,3,4,2,5,6,7],
      [8,5,9,7,6,1,4,2,3],
      [4,2,6,8,5,3,7,9,1],
      [7,1,3,9,2,4,8,5,6],
      [9,6,1,5,3,7,2,8,4],
      [2,8,7,4,1,9,6,3,5],
      [3,4,5,2,8,6,1,7,9]
    ];

    // Shuffle rows within blocks
    const shuffled = JSON.parse(JSON.stringify(base));

    // Remove random cells (40-50 cells)
    const puzzle = JSON.parse(JSON.stringify(shuffled));
    const cellsToRemove = 40 + Math.floor(Math.random() * 10);

    for (let i = 0; i < cellsToRemove; i++) {
      const row = Math.floor(Math.random() * 9);
      const col = Math.floor(Math.random() * 9);
      puzzle[row][col] = 0;
    }

    sudokuSolution = shuffled;
    return puzzle;
  }

  function renderSudoku(puzzle) {
    sudokuGrid.innerHTML = "";

    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        const cell = document.createElement("div");
        cell.className = "sudoku-cell";

        const input = document.createElement("input");
        input.type = "text";
        input.maxLength = 1;
        input.dataset.row = row;
        input.dataset.col = col;

        if (puzzle[row][col] !== 0) {
          input.value = puzzle[row][col];
          input.disabled = true;
          cell.classList.add("fixed");
        }

        input.addEventListener("input", (e) => {
          e.target.value = e.target.value.replace(/[^1-9]/g, "");
        });

        cell.appendChild(input);
        sudokuGrid.appendChild(cell);
      }
    }
  }

  function typeMessage(element, text, speed = 50) {
    element.innerHTML = "";
    let index = 0;

    function type() {
      if (index < text.length) {
        element.innerHTML += text[index] === "\n" ? "<br>" : text[index];
        index++;
        setTimeout(type, speed);
      }
    }
    type();
  }

  function createVictoryStars() {
    const count = 30; // Not too many to avoid lag

    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const startX = Math.random() * window.innerWidth;
        const startY = -50;

        victoryStars.push({
          x: startX,
          y: startY,
          vx: (Math.random() - 0.5) * 3,
          vy: Math.random() * 4 + 4,
          element: null
        });
      }, i * 40);
    }
  }

  function checkSudoku() {
    const cells = sudokuGrid.querySelectorAll("input");
    let correct = true;
    let allFilled = true;

    cells.forEach(input => {
      const row = parseInt(input.dataset.row);
      const col = parseInt(input.dataset.col);
      const value = parseInt(input.value) || 0;

      input.parentElement.classList.remove("error");

      if (!input.value) {
        allFilled = false;
      }

      if (value !== sudokuSolution[row][col]) {
        correct = false;
        if (value !== 0) {
          input.parentElement.classList.add("error");
        }
      }
    });

    if (!allFilled) {
      typeMessage(sudokuMessage, "Sudoku is not completed yet...");
    } else if (correct) {
      stopTimer();
      const finalTime = sudokuTimer.textContent;
      typeMessage(sudokuMessage, `🎉 Congratulations! Time: ${finalTime}`);

      // Victory animation - numbers fall
      const cellElements = Array.from(sudokuGrid.querySelectorAll(".sudoku-cell"));
      anime({
        targets: cellElements,
        translateY: [0, 1000],
        rotate: () => Math.random() * 720 - 360,
        opacity: [1, 0],
        delay: anime.stagger(30),
        duration: 1500,
        easing: "easeInQuad"
      });

      // Star shower across whole screen
      createVictoryStars();

    } else {
      typeMessage(sudokuMessage, "Some numbers are incorrect...");
      setTimeout(() => {
        cells.forEach(input => input.parentElement.classList.remove("error"));
      }, 2000);
    }
  }

  function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    startTime = Date.now() - elapsedTime;

    timerInterval = setInterval(() => {
      elapsedTime = Date.now() - startTime;
      const seconds = Math.floor(elapsedTime / 1000);
      const minutes = Math.floor(seconds / 60);
      const displaySeconds = seconds % 60;

      sudokuTimer.textContent = `${String(minutes).padStart(2, '0')}:${String(displaySeconds).padStart(2, '0')}`;
    }, 1000);
  }

  function stopTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }

  function resetTimer() {
    stopTimer();
    elapsedTime = 0;
    sudokuTimer.textContent = "00:00";
  }

  function newSudoku() {
    sudokuPuzzle = generateSudoku();
    renderSudoku(sudokuPuzzle);
    sudokuMessage.innerHTML = "";
    victoryStars = [];
    resetTimer();
    startTimer();
  }

  // Victory stars animation loop
  function animateVictoryStars() {
    victoryStars = victoryStars.filter(star => {
      star.y += star.vy;
      star.x += star.vx;

      if (star.y > window.innerHeight) {
        return false;
      }

      // Draw on canvas
      if (bgAnimation && bgAnimation.ctx) {
        const ctx = bgAnimation.ctx;
        const size = 3;

        ctx.save();
        ctx.translate(star.x, star.y);
        ctx.rotate(star.y * 0.01);

        // Star shape
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
          const angle = (i * 4 * Math.PI) / 5;
          const x = Math.cos(angle) * size;
          const y = Math.sin(angle) * size;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();

        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size * 2);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.restore();
      }

      return true;
    });

    if (victoryStars.length > 0) {
      requestAnimationFrame(animateVictoryStars);
    }
  }

  // Start victory animation when stars are created
  setInterval(() => {
    if (victoryStars.length > 0) {
      animateVictoryStars();
    }
  }, 16);

  yearTrigger.addEventListener("click", () => {
    sudokuModal.classList.add("show");
    if (sudokuGrid.children.length === 0) {
      newSudoku();
    } else if (!timerInterval) {
      startTimer();
    }
  });

  sudokuClose.addEventListener("click", () => {
    sudokuModal.classList.remove("show");
    stopTimer();
  });

  sudokuModal.addEventListener("click", (e) => {
    if (e.target === sudokuModal) {
      sudokuModal.classList.remove("show");
      stopTimer();
    }
  });

  sudokuCheck.addEventListener("click", checkSudoku);
  sudokuNew.addEventListener("click", newSudoku);

  // Year typing effect like "About me" (character by character, only 1 digit changes)
  function typeEraseYear() {
    const yearTrigger = document.getElementById("year-trigger");
    let delay = 0;

    // Step 1: Erase from "2025" to "202" (remove "5")
    setTimeout(() => {
      yearTrigger.textContent = "202";
    }, delay += 100);

    // Step 2: Type "6" -> "2026"
    setTimeout(() => {
      yearTrigger.textContent = "2026";
    }, delay += 150);

    // Step 3: Wait 5 seconds, then reverse
    setTimeout(() => {
      let reverseDelay = 0;

      // Erase "6" -> "202"
      setTimeout(() => {
        yearTrigger.textContent = "202";
      }, reverseDelay += 100);

      // Type "5" -> "2025"
      setTimeout(() => {
        yearTrigger.textContent = "2025";
      }, reverseDelay += 150);

    }, delay + 5000);
  }

  // Randomly trigger year change every 8-15 seconds
  function scheduleYearChange() {
    const delay = 8000 + Math.random() * 7000;
    setTimeout(() => {
      typeEraseYear();
      scheduleYearChange();
    }, delay);
  }

  scheduleYearChange();

  // Lamp physics
  const lampButton = document.getElementById("light-dark-btn");
  const lamp = lampButton.querySelector(".theme-icon, .theme-icon-dark");
  let lampAngle = 0;
  let lampVelocity = 0;
  const lampDamping = 0.88;
  const lampStiffness = 0.12;

  function updateLampPhysics(mouseX, mouseY) {
    if (!lampButton) return;

    const rect = lampButton.getBoundingClientRect();
    const lampCenterX = rect.left + rect.width / 2;
    const lampTopY = rect.top;

    const dx = mouseX - lampCenterX;
    const dy = mouseY - lampTopY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const maxDistance = 120;

    if (distance < maxDistance) {
      const force = (1 - distance / maxDistance) * 0.25;
      const normalizedDx = dx / distance;
      const pushAngle = -normalizedDx * force * 15;
      lampVelocity += pushAngle;
    }

    lampVelocity += -lampAngle * lampStiffness;
    lampVelocity *= lampDamping;
    lampAngle += lampVelocity;

    const activeLamp = body.classList.contains("dark")
      ? lampButton.querySelector(".theme-icon-dark")
      : lampButton.querySelector(".theme-icon");

    if (activeLamp) {
      activeLamp.style.transform = `rotate(${lampAngle}deg)`;
    }
  }

  // Disable animations on mobile
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  if (!isMobile) {
    let animationFrameId;
    document.addEventListener("mousemove", (e) => {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(() => {
        updateLampPhysics(e.clientX, e.clientY);
      });
    });
  }

  // Magnetic buttons with smooth following (only on desktop)
  if (!isMobile) {
    const footerButtons = document.querySelectorAll("footer .btn");
    const buttonTargets = new Map();

    footerButtons.forEach((btn) => {
      buttonTargets.set(btn, { x: 0, y: 0, currentX: 0, currentY: 0 });

      const handleMagneticEffect = (clientX, clientY) => {
        const rect = btn.getBoundingClientRect();
        const x = clientX - rect.left - rect.width / 2;
        const y = clientY - rect.top - rect.height / 2;
        const distance = Math.sqrt(x * x + y * y);
        const maxDistance = 80;

        if (distance < maxDistance) {
          const strength = (1 - distance / maxDistance) * 0.4;
          const target = buttonTargets.get(btn);
          target.x = x * strength;
          target.y = y * strength;
        }
      };

      const handleReset = () => {
        const target = buttonTargets.get(btn);
        target.x = 0;
        target.y = 0;
        btn.style.transition = "background 0.3s ease, color 0.3s ease, transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)";
      };

      btn.addEventListener("mouseenter", () => {
        btn.style.transition = "background 0.3s ease, color 0.3s ease";
      });

      btn.addEventListener("mousemove", (e) => {
        handleMagneticEffect(e.clientX, e.clientY);
      });

      btn.addEventListener("mouseleave", handleReset);

      // Ripple effect
      btn.addEventListener("click", (e) => {
        const ripple = document.createElement("span");
        ripple.classList.add("ripple");
        const rect = btn.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;

        btn.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
      });
    });

    // Smooth magnetic animation loop
    function animateMagneticButtons() {
      buttonTargets.forEach((target, btn) => {
        const ease = 0.15;
        target.currentX += (target.x - target.currentX) * ease;
        target.currentY += (target.y - target.currentY) * ease;

        if (Math.abs(target.currentX) > 0.01 || Math.abs(target.currentY) > 0.01) {
          btn.style.transform = `translate(${target.currentX}px, ${target.currentY}px)`;
        } else if (target.x === 0 && target.y === 0) {
          btn.style.transform = "translate(0, 0)";
        }
      });

      requestAnimationFrame(animateMagneticButtons);
    }
    animateMagneticButtons();
  }

  function toggleDarkTheme() {
    const isDark = !body.classList.contains("dark"); // Will be the NEW state after toggle
    body.classList.toggle("dark");

    const allButtons = document.querySelectorAll(".btn");
    allButtons.forEach((btn) => btn.classList.toggle("dark"));

    arrows.forEach((arrow) => arrow.classList.toggle("dark"));
    themeSecondary.forEach((el) => el.classList.toggle("dark"));

    // Update game counter theme
    if (gameCounter) {
      gameCounter.classList.toggle("dark", isDark);
    }

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
            "My name is Artur.\nI am a sociable and friendly person.\nI like programming and creating useful projects.",
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
    });
  });
});
