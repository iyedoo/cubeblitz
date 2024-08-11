const wrapper = document.querySelector(".wrapper");
const carousel = document.querySelector(".carousel");
const arrowBtns = document.querySelectorAll(".wrapper .arrow");
const carouselChildrens = [...carousel.children];

let isDragging = false, startX, startScrollLeft, timeoutId;

// Function to get the number of cards that can fit in the carousel
const getCardPerView = () => {
    return Math.floor(carousel.offsetWidth / carouselChildrens[0].offsetWidth);
}

let cardPerView = getCardPerView();

// Function to update carousel for infinite scroll
const updateCarousel = () => {
    cardPerView = getCardPerView();
    
    // Remove existing clones
    carouselChildrens.forEach(card => {
        if (card.classList.contains('clone')) {
            card.remove();
        }
    });

    // Insert copies of the last few cards to beginning of carousel for infinite scrolling
    carouselChildrens.slice(-cardPerView).reverse().forEach(card => {
        const clone = card.cloneNode(true);
        clone.classList.add('clone');
        carousel.insertAdjacentElement("afterbegin", clone);
    });

    // Insert copies of the first few cards to end of carousel for infinite scrolling
    carouselChildrens.slice(0, cardPerView).forEach(card => {
        const clone = card.cloneNode(true);
        clone.classList.add('clone');
        carousel.insertAdjacentElement("beforeend", clone);
    });

    // Reset scroll position
    carousel.scrollLeft = carousel.offsetWidth;
}

updateCarousel();

// Add event listeners for the arrow buttons to scroll the carousel left and right
arrowBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        const cardWidth = carousel.querySelector(".card").offsetWidth;
        carousel.scrollLeft += btn.id === "left" ? -cardWidth : cardWidth;
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
    const cardWidth = carousel.querySelector(".card").offsetWidth;
    if(carousel.scrollLeft === 0) {
        carousel.classList.add("no-transition");
        carousel.scrollLeft = carousel.scrollWidth - (2 * carousel.offsetWidth);
        carousel.classList.remove("no-transition");
    }
    else if(Math.ceil(carousel.scrollLeft) === carousel.scrollWidth - carousel.offsetWidth) {
        carousel.classList.add("no-transition");
        carousel.scrollLeft = cardWidth * cardPerView;
        carousel.classList.remove("no-transition");
    }

    clearTimeout(timeoutId);
    if(!wrapper.matches(":hover")) autoPlay();
}

const autoPlay = () => {
    if(window.innerWidth < 800) return;
    const cardWidth = carousel.querySelector(".card").offsetWidth;
    timeoutId = setTimeout(() => carousel.scrollLeft += cardWidth, 2500);
}

autoPlay();

carousel.addEventListener("mousedown", dragStart);
carousel.addEventListener("mousemove", dragging);
document.addEventListener("mouseup", dragStop);
carousel.addEventListener("scroll", infiniteScroll);
wrapper.addEventListener("mouseenter", () => clearTimeout(timeoutId));
wrapper.addEventListener("mouseleave", autoPlay);
window.addEventListener("resize", updateCarousel);
