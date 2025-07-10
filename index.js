function hackerType(text, element, delay = 20, callback) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let i = 0;

  function nextChar() {
    if (i < text.length) {
      let frame = 0;
      const scramble = setInterval(() => {
        if (frame < 3) {
          element.textContent =
            text.substring(0, i) + chars[Math.floor(Math.random() * chars.length)];
          frame++;
        } else {
          clearInterval(scramble);
          element.textContent = text.substring(0, i + 1);
          i++;
          setTimeout(nextChar, delay);
        }
      }, 12);
    } else if (callback) callback();
  }

  nextChar();
}

function launch() {
  const container = document.querySelector('.container');
  container.classList.add("slide");

  setTimeout(() => {
    window.location.href = "main.html";
  }, 1000); // same as animation duration
}


window.onload = () => {
  const nameText = "Vijay Marreddy Yeruva";
  const titleText = "Welcome to My Portfolio";
  const nameElement = document.getElementById("typed-name");
  const titleElement = document.getElementById("typed-title");
  const launchBtn = document.querySelector(".launch-btn");

  // Typing animations
  hackerType(nameText, nameElement, 25, () => {
    hackerType(titleText, titleElement, 20, () => {
      // Make button visible and clickable
      launchBtn.classList.add("show");
    });
  });

  launchBtn.addEventListener("click", launch);
};
