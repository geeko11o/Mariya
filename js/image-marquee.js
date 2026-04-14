document.addEventListener("DOMContentLoaded", () => {
  const marquee = document.querySelector(".image-marquee");
  const track = marquee?.querySelector(".image-track");
  if (!marquee || !track) return;

  const items = track.querySelectorAll(".image-item");

  let position = 0;
  let autoScroll = true;
  let activeItem = null;

  const SPEED = 1; // 🔧 speed control

  /* ===============================
     AUTO SCROLL LOOP (RIGHT → LEFT REVERSED)
  =============================== */

  function animate() {
    if (autoScroll) {
      position += SPEED;

      const maxTranslate =
        track.scrollWidth - marquee.clientWidth;

      // when fully right → reset back
      if (position >= 0) {
        position = -maxTranslate;
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
