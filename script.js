document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".btn");
  const frames = document.querySelectorAll(".frame");
  const cards = document.querySelectorAll(".card");
  const body = document.querySelectorAll(".body");


  const welcomeText1 = document.querySelector("#welcome-text-1");
  const welcomeText2 = document.querySelector("#welcome-text-2");

  const moreButton = document.querySelector(".btn-more");
  const overlay = document.querySelector(".overlay");

  const projectCards = document.querySelectorAll(".project-card");
  const projectTexts = document.querySelectorAll(".project-text");
  const arrows = document.querySelectorAll(".swiper-button-prev, .swiper-button-next");
  const logoPaths = document.querySelectorAll(".logo-path");

  const lampPaths = document.querySelectorAll(".lamp-path");
  const lampStart = document.querySelectorAll(".lamp-start");
  const lampStop = document.querySelectorAll(".lamp-stop");

  let isTypingAboutMe = true;
  let typingTimeout = null;

  // circle ____________________________________________

  const circle = document.createElement("div");

  circle.id = "circle";
  circle.style.position = "fixed";
  circle.style.width = "1rem";
  circle.style.height = "1rem";
  circle.style.backgroundColor = "#333333";
  circle.style.borderRadius = "50%";
  circle.style.pointerEvents = "none";
  circle.style.zIndex = "1000";
  circle.style.transform = "translate(-50%, -50%)";

  document.body.appendChild(circle);

  let mouseX = 0,
    mouseY = 0;
  let circleX = 0,
    circleY = 0;
  const circleSpeed = 0.02;

  document.addEventListener("mousemove", throttle((event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
  }, 16));

  function animateCircle() {
    circleX += (mouseX + 10 - circleX) * circleSpeed;
    circleY += (mouseY - 50 - circleY) * circleSpeed;
    circle.style.transform = `translate(${circleX}px, ${circleY}px)`;
    requestAnimationFrame(animateCircle);
  }

  animateCircle();

  // circle ____________________________________________END

  setTimeout(() => {
    welcomeText1.style.animation = "fadeOutAndUp 1.5s forwards";

    setTimeout(() => {
      welcomeText1.classList.add("hidden");
      welcomeText2.classList.remove("hidden");
      welcomeText2.style.animation = "fadeIn 0.5s forwards";
    }, 500);
  }, 1500);

  function throttle(func, limit) {
    let lastFunc;
    let lastRan;
    return function() {
      const context = this;
      const args = arguments;
      if (!lastRan) {
        func.apply(context, args);
        lastRan = Date.now();
      } else {
        clearTimeout(lastFunc);
        lastFunc = setTimeout(function() {
          if ((Date.now() - lastRan) >= limit) {
            func.apply(context, args);
            lastRan = Date.now();
          }
        }, limit - (Date.now() - lastRan));
      }
    };
  }

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetId = button.getAttribute("data-target");
      const targetFrame = document.getElementById(targetId);

      const targetBtnFrame = document.getElementById(button.getAttribute("id"));

      if (targetId === "theme") {
        body.forEach((body) => body.classList.toggle("dark"));
        frames.forEach((frame) => frame.classList.toggle("dark"));
        buttons.forEach((btn) => btn.classList.toggle("dark"));
        arrows.forEach((arrow) => arrow.classList.toggle("dark"));
        projectCards.forEach((card) => card.classList.toggle("dark"));
        projectTexts.forEach((text) => text.classList.toggle("dark"));
        logoPaths.forEach((path) => path.classList.toggle("dark"));
        lampPaths.forEach((path) => path.classList.toggle("dark"));
        lampStart.forEach((stop) => stop.classList.toggle("dark"));
        lampStop.forEach((stop) => stop.classList.toggle("dark"));
      } else {
      frames.forEach((frame) => frame.classList.remove("active"));
      targetFrame.classList.add("active");

      buttons.forEach((btn) => btn.classList.remove("active"));
      targetBtnFrame.classList.add("active");

      if (targetId === "welcome") {
        isTypingAboutMe = false;

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
          }, 500); //time (ms)
        }, 1500); //time (ms)
      }

      if (targetId === "about-me") {
        isTypingAboutMe = false;
        clearTimeout(typingTimeout);
        document.getElementById("typing-text").innerHTML = "";
        const textAboutMe =
          "My name is Artur.\nI am a sociable and friendly person.\nI like programming and creating useful projects.";
        const speedTextAboutMe = 50; // speedTime (мс)
        let index = 0;

        isTypingAboutMe = true;

        function typeText() {
          if (index < textAboutMe.length && isTypingAboutMe) {
            const currentChar = textAboutMe[index];
            if (currentChar === "\n") {
              document.getElementById("typing-text").innerHTML += "<br>";
            } else {
              document.getElementById("typing-text").innerHTML += currentChar;
            }

            index++;
            // setTimeout(typeText, speedTextAboutMe);
            typingTimeout = setTimeout(typeText, speedTextAboutMe);
          }
        }

        typeText();
      }

      if (targetId === "stack") {
        isTypingAboutMe = false;
        const isMobile = window.matchMedia("(pointer: coarse)").matches;

        if (!isMobile) {
          cards.forEach((card) => {
            card.addEventListener("mousemove", (e) => {
              const rect = card.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const y = e.clientY - rect.top;

              const centerX = rect.width / 2;
              const centerY = rect.height / 2;

              const rotateX = (y - centerY) / 7;
              const rotateY = (x - centerX) / 7;

              const shadowX = (x - centerX) / 7;
              const shadowY = (y - centerY) / 7;

              requestAnimationFrame(() => {
                card.style.transform = `rotateX(${-rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
                card.style.boxShadow = `${-shadowX}px ${-shadowY}px 1em rgba(0, 0, 0, 0.3)`;
              });
            });

            card.addEventListener("mouseleave", () => {
              requestAnimationFrame(() => {
                card.style.transform = "rotateX(0) rotateY(0) scale(1)";
                card.style.boxShadow = "0 0em 0em rgba(0, 0, 0, 0)";
              });
            });
          });
        }
      }

      if (targetId === "projects") {
        isTypingAboutMe = false;

        const swiper = new Swiper(".swiper", {
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
      }

      if (targetId === "contacts") {
        isTypingAboutMe = false;
      }

      if (targetId === "more") {
        isTypingAboutMe = false;

        moreButton.addEventListener("click", () => {
          overlay.classList.toggle("visible");
        });
      }}
    });
  });
});
