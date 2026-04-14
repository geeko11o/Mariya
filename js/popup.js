document.addEventListener("DOMContentLoaded", function () {

  // Numeric-only enforcement for phone field
  const phoneInput = document.getElementById("phone");
  if (phoneInput) {
    phoneInput.addEventListener("input", function (e) {
      this.value = this.value.replace(/[^0-9]/g, "");
    });
  }

  // Open popup for all 3 buttons
  const heroBtn = document.getElementById("openMentorFormHero");
  const storyBtn = document.getElementById("openMentorFormStory");
  const ctaBtn = document.getElementById("openMentorFormCTA");

  if (heroBtn) heroBtn.onclick = openPopup;
  if (storyBtn) storyBtn.onclick = openPopup;
  if (ctaBtn) ctaBtn.onclick = openPopup;

  function openPopup() {
    document.getElementById("mentorModal").style.display = "flex";
  }

  // Close popup
  const closeBtn = document.querySelector(".mentor-close");
  if (closeBtn) {
    closeBtn.onclick = function () {
      document.getElementById("mentorModal").style.display = "none";
    };
  }

  // Close on outside click
  window.onclick = function (e) {
    if (e.target == document.getElementById("mentorModal")) {
      document.getElementById("mentorModal").style.display = "none";
    }
  };

  // WhatsApp Submission
  const mentorForm = document.getElementById("mentorForm");
  if (mentorForm) {
    mentorForm.addEventListener("submit", function (e) {
      e.preventDefault();

      let name = document.getElementById("fullName").value;
      let phone = document.getElementById("phone").value;
      let age = document.getElementById("age").value;
      let gender = document.getElementById("gender").value;
      let profession = document.getElementById("profession").value;

      let message = `Hello Mariya Ma’am,%0AI am interested in your program.%0A%0AHere are my details:%0AName: ${name}%0APhone: ${phone}%0AAge: ${age}%0AGender: ${gender}%0AProfession: ${profession}%0A%0APlease tell me what I have to do next.%0AThank you!`;

      // Close popup before redirect
      document.getElementById("mentorModal").style.display = "none";

      // Open WhatsApp
      window.open(`https://wa.me/917780826099?text=${message}`, "_blank");
    });
  }

});
