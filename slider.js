document.addEventListener('DOMContentLoaded', () => {
    const wrapper = document.querySelector(".wrapper");
    const carousel = document.querySelector(".carousel");
    const arrowBtns = document.querySelectorAll(".wrapper .arrow");
    const firstCardWidth = carousel.querySelector(".card").offsetWidth;
    const carouselChildren = [...carousel.children];
  
    let isDragging = false, startX, startScrollLeft, timeoutId;
    let cardPerView = Math.round(carousel.offsetWidth / firstCardWidth);
  
    // Insert copies of last few cards to beginning of carousel for infinite scrolling
    carouselChildren.slice(-cardPerView).reverse().forEach(card => {
      carousel.insertAdjacentHTML("afterbegin", card.outerHTML);
    });
  
    // Insert copies of first few cards to end of carousel for infinite scrolling
    carouselChildren.slice(0, cardPerView).forEach(card => {
      carousel.insertAdjacentHTML("beforeend", card.outerHTML);
    });
  
    // Add event listeners for the arrow buttons to scroll the carousel left and right
    arrowBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        carousel.scrollLeft += btn.id === "left" ? -firstCardWidth : firstCardWidth;
      });
    });
  
    const dragStart = (e) => {
      isDragging = true;
      carousel.classList.add("dragging");
      startX = e.pageX;
      startScrollLeft = carousel.scrollLeft;
    }
  
    const dragging = (e) => {
      if(!isDragging) return;
      carousel.scrollLeft = startScrollLeft - (e.pageX - startX);
    }
  
    const dragStop = () => {
      isDragging = false;
      carousel.classList.remove("dragging");
    }
  
    const infiniteScroll = () => {
      if(carousel.scrollLeft === 0) {
        carousel.classList.add("no-transition");
        carousel.scrollLeft = carousel.scrollWidth - (2 * carousel.offsetWidth);
        carousel.classList.remove("no-transition");
      }
      else if(Math.ceil(carousel.scrollLeft) === carousel.scrollWidth - carousel.offsetWidth) {
        carousel.classList.add("no-transition");
        carousel.scrollLeft = carousel.offsetWidth;
        carousel.classList.remove("no-transition");
      }
  
      clearTimeout(timeoutId);
      if(!wrapper.matches(":hover")) autoPlay();
    }
  
    const autoPlay = () => {
      if(window.innerWidth < 800) return;
      timeoutId = setTimeout(() => carousel.scrollLeft += firstCardWidth, 2500);
    }
  
    carousel.addEventListener("mousedown", dragStart);
    carousel.addEventListener("mousemove", dragging);
    document.addEventListener("mouseup", dragStop);
    carousel.addEventListener("scroll", infiniteScroll);
    wrapper.addEventListener("mouseenter", () => clearTimeout(timeoutId));
    wrapper.addEventListener("mouseleave", autoPlay);
  
    window.addEventListener('resize', () => {
      cardPerView = Math.round(carousel.offsetWidth / firstCardWidth);
    });
  });
