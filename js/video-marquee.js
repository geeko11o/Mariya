document.addEventListener("DOMContentLoaded", () => {
  const marquee = document.querySelector(".video-marquee");
  const track = marquee?.querySelector(".video-track");
  if (!marquee || !track) return;

  const items = track.querySelectorAll(".video-item");

  let position = 0;
  let autoScroll = true;
  let restartTimer = null;
  let activeItem = null;

  const speed = 0.60;

  /* ===============================
     AUTO SCROLL LOOP
  =============================== */

  function animate() {
    if (autoScroll && !isAnyVideoPlaying()) {
      position -= speed;

      const maxTranslate =
        track.scrollWidth - marquee.clientWidth;

      if (Math.abs(position) >= maxTranslate) {
        position = 0;
      }

      track.style.transform =
        `translate3d(${position}px, 0, 0)`;
    }

    requestAnimationFrame(animate);
  }

  /* ===============================
     VIDEO PLAY STATE CHECK
  =============================== */

  function isAnyVideoPlaying() {
    let playing = false;

    items.forEach(item => {
      const iframe = item.querySelector("iframe");
      if (!iframe) return;

      // If iframe has focus → assume playing
      if (document.activeElement === iframe) {
        playing = true;
      }
    });

    return playing;
  }

  /* ===============================
     STOP & RESTART AUTO SCROLL
  =============================== */

  function stopAutoScroll() {
    autoScroll = false;
    clearTimeout(restartTimer);
  }

  function restartAutoScrollAfterDelay() {
    clearTimeout(restartTimer);
    restartTimer = setTimeout(() => {
      if (!isAnyVideoPlaying()) {
        autoScroll = true;
      }
    }, 3000);
  }

  /* ===============================
     CARD CLICK HANDLING
  =============================== */

  items.forEach(item => {
    item.addEventListener("click", e => {
      e.stopPropagation();

      if (activeItem === item) return;

      stopAutoScroll();

      if (activeItem) {
        activeItem.classList.remove("active-card");
      }

      activeItem = item;
      item.classList.add("active-card");

      restartAutoScrollAfterDelay();
    });
  });

  /* ===============================
     CLICK OUTSIDE → RESET
  =============================== */

  document.addEventListener("click", () => {
    if (!activeItem) return;

    activeItem.classList.remove("active-card");
    activeItem = null;

    restartAutoScrollAfterDelay();
  });

  animate();
});

marquee.addEventListener("wheel", e => e.preventDefault(), {
  passive: false
});

marquee.addEventListener("touchmove", e => e.preventDefault(), {
  passive: false
});
