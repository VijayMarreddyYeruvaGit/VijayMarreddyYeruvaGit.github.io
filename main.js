const roles = ["a Full Stack Developer!", "Born to Code!", "a Coding Freak!"];
const typingElement = document.getElementById("typing");

let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;

function type() {
  const currentRole = roles[roleIndex];
  const displayText = currentRole.substring(0, charIndex);
  typingElement.textContent = displayText;

  if (!isDeleting && charIndex < currentRole.length) {
    charIndex++;
    setTimeout(type, 100);
  } else if (isDeleting && charIndex > 0) {
    charIndex--;
    setTimeout(type, 50);
  } else {
    isDeleting = !isDeleting;
    if (!isDeleting) roleIndex = (roleIndex + 1) % roles.length;
    setTimeout(type, isDeleting ? 1000 : 200);
  }
}

function scrollToSection(id) {
  const section = document.getElementById(id.toLowerCase());
  if (section) section.scrollIntoView({ behavior: "smooth" });
}

// Start typing animation
type();

// Reveal animations after page loads
window.addEventListener("load", () => {
  const animatedElements = document.querySelectorAll(
    ".about-image, .about-info, .text-section, .image-section"
  );
  animatedElements.forEach(el => el.classList.add("animate"));
});


