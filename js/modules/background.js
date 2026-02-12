export class BackgroundAnimation {
  constructor() {
    this.canvas = document.getElementById("background-canvas");
    this.ctx = this.canvas.getContext("2d");
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
    });

    // Track mouse for interactive effects
    window.addEventListener("mousemove", (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });

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
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

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
        x = Math.random() < 0.5 ? Math.random() * margin : this.canvas.width - Math.random() * margin;
        y = Math.random() * this.canvas.height;
      } else {
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
    const grays = ["#333333", "#555555", "#777777", "#999999", "#aaaaaa", "#cccccc"];
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
    this.ctx.strokeStyle = this.isDark ? "rgba(255, 255, 255, 0.25)" : "rgba(7, 7, 7, 0.25)";
    this.ctx.lineWidth = 1.5;
    this.ctx.stroke();

    const gradient = this.ctx.createRadialGradient(
      this.centerX, this.centerY, orbit.radius - 15,
      this.centerX, this.centerY, orbit.radius + 15
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
    const x = this.centerX + Math.cos(planet.angle + orbit.angle) * orbit.radius;
    const y = this.centerY + Math.sin(planet.angle + orbit.angle) * orbit.radius;
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
      x - planet.size * 0.3, y - planet.size * 0.3, 0,
      x, y, planet.size * pulse
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
      particle.x, particle.y, 0,
      particle.x, particle.y, particle.radius * 2
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
        length: 15 + Math.random() * 15,
        opacity: 1,
        lifetime: 0,
        maxLifetime: 100
      });

      this.createShootingStar();
    }, delay);
  }

  createMeteorShower() {
    const delay = 60000 + Math.random() * 60000;

    setTimeout(() => {
      const count = 8 + Math.floor(Math.random() * 7);

      for (let i = 0; i < count; i++) {
        setTimeout(() => {
          const startX = this.canvas.width - 50 + Math.random() * 100;
          const startY = -100 + Math.random() * 200;

          this.shootingStars.push({
            x: startX,
            y: startY,
            vx: -8 - Math.random() * 4,
            vy: 6 + Math.random() * 3,
            length: 25 + Math.random() * 20,
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
      star.x, star.y,
      star.x - star.vx * tailLength, star.y - star.vy * tailLength
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

    const glowGradient = this.ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, 8);
    glowGradient.addColorStop(0, `rgba(${color}, ${star.opacity})`);
    glowGradient.addColorStop(1, `rgba(${color}, 0)`);

    this.ctx.beginPath();
    this.ctx.arc(star.x, star.y, 8, 0, Math.PI * 2);
    this.ctx.fillStyle = glowGradient;
    this.ctx.fill();

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
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile) return;

    const maxDistance = 150;
    const maxDistanceSquared = maxDistance * maxDistance;

    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const distanceSquared = dx * dx + dy * dy;

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

    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
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
