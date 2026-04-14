document.addEventListener("DOMContentLoaded", () => {
  const marquee = document.querySelector(".certificate-marquee");
  const track = marquee?.querySelector(".certificate-track");
  if (!marquee || !track) return;

  const items = track.querySelectorAll(".certificate-item");

  let position = 0;
  let autoScroll = true;
  let activeItem = null;

  const SPEED = 1; // 🔧 speed control

  /* ===============================
     AUTO SCROLL LOOP (NORMAL DIRECTION)
  =============================== */

  function animate() {
    if (autoScroll) {
      position -= SPEED;

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
     CLICK → PAUSE + ACTIVE CARD
  =============================== */

  items.forEach(item => {
    item.addEventListener("click", e => {
      e.stopPropagation();

      autoScroll = false;

      if (activeItem && activeItem !== item) {
        activeItem.classList.remove("active-card");
      }

      activeItem = item;
      item.classList.add("active-card");
    });
  });

  /* ===============================
     CLICK OUTSIDE → RESET
  =============================== */

  document.addEventListener("click", () => {
    if (!activeItem) return;

    activeItem.classList.remove("active-card");
    activeItem = null;

    autoScroll = true;
  });

  animate();
});
