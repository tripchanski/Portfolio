export function throttle(func, limit) {
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

export function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

export function typeMessage(element, text, speed = 50) {
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
