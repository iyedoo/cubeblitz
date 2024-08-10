const wrapper = document.querySelector(".wrapper");
const carousel = document.querySelector(".carousel");
const arrowBtns = document.querySelectorAll(".arrow");
const firstCardWidth = carousel.querySelector(".card").offsetWidth;

arrowBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    if (btn.classList.contains("left")) {
      carousel.scrollLeft -= firstCardWidth;
    } else if (btn.classList.contains("right")) {
      carousel.scrollLeft += firstCardWidth;
    }
  });
});

let isDragging = false, startX, startScrollLeft;

const dragStart = (e) => {
  isDragging = true;
  carousel.classList.add("dragging");
  startX = e.pageX;
  startScrollLeft = carousel.scrollLeft;
}

const dragging = (e) => {
  if (!isDragging) return;
  carousel.scrollLeft = startScrollLeft - (e.pageX - startX);
}

const dragStop = () => {
  isDragging = false;
  carousel.classList.remove("dragging");
}

carousel.addEventListener("mousedown", dragStart);
carousel.addEventListener("mousemove", dragging);
document.addEventListener("mouseup", dragStop);