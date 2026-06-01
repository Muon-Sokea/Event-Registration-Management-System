// ─────────────────────────────────────
// Hero Slideshow — Infinite forward loop
// 4 real slides + 1 clone of slide 1
// Flow: 1 → 2 → 3 → 4 → [clone of 1]
//       then silently jump back to real 1
//       user sees: always moving forward!
// ─────────────────────────────────────

const TOTAL_SLIDES  = 4;       // real slides only
const SLIDE_SPEED   = 850;     // ms — matches CSS transition
const SLIDE_DELAY   = 4500;    // ms between auto slides

let slideIndex      = 0;       // current real index (0–3)
let slideAnimating  = false;
let slideInterval   = null;

// Move track to a position (0 = slide1, 1 = slide2, etc.)
// Each slide = 20% of the 500%-wide track
function moveTrack(position, animate) {
  const track = document.querySelector(".hero-slides");
  if (!track) return;

  if (!animate) {
    // Instant — no animation
    track.style.transition = "none";
  } else {
    track.style.transition =
      `transform ${SLIDE_SPEED}ms cubic-bezier(0.645, 0.045, 0.355, 1.000)`;
  }

  track.style.transform = `translateX(-${position * 20}%)`;
}

// Update which dot is active (always based on real index 0–3)
function updateDots(index) {
  document.querySelectorAll(".hero-dot").forEach((dot, i) => {
    dot.classList.toggle("active", i === index);
  });
}

// Go to next slide — always forward
function nextSlide() {
  if (slideAnimating) return;
  slideAnimating = true;

  const nextPosition = slideIndex + 1;

  if (nextPosition < TOTAL_SLIDES) {
    // Normal forward: go to next real slide
    slideIndex = nextPosition;
    moveTrack(slideIndex, true);
    updateDots(slideIndex);
    setTimeout(() => { slideAnimating = false; }, SLIDE_SPEED);

  } else {
    // At slide 4 — move forward to clone of slide 1 (position 4)
    moveTrack(4, true);
    updateDots(0); // dot shows slide 1 active immediately

    // After animation finishes, silently jump to real slide 1
    setTimeout(() => {
      slideIndex = 0;
      moveTrack(0, false); // instant, no animation

      // Re-enable transition after browser processes the instant jump
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const track = document.querySelector(".hero-slides");
          if (track) {
            track.style.transition =
              `transform ${SLIDE_SPEED}ms cubic-bezier(0.645, 0.045, 0.355, 1.000)`;
          }
        });
      });

      slideAnimating = false;
    }, SLIDE_SPEED + 50); // tiny extra buffer
  }
}

// Jump to specific slide when dot clicked
function goToSlide(index) {
  if (slideAnimating || index === slideIndex) return;
  slideAnimating = true;

  slideIndex = index;
  moveTrack(slideIndex, true);
  updateDots(slideIndex);

  restartAutoplay();
  setTimeout(() => { slideAnimating = false; }, SLIDE_SPEED);
}

function startAutoplay() {
  slideInterval = setInterval(nextSlide, SLIDE_DELAY);
}

function restartAutoplay() {
  clearInterval(slideInterval);
  startAutoplay();
}

// ─────────────────────────────────────
// Mobile swipe — forward only
// ─────────────────────────────────────

function initSwipe() {
  const hero = document.querySelector(".hero");
  if (!hero) return;

  let startX = 0;

  hero.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
  }, { passive: true });

  hero.addEventListener("touchend", (e) => {
    const diff = startX - e.changedTouches[0].clientX;
    if (diff > 50) nextSlide(); // left swipe = forward only
  }, { passive: true });
}

// ─────────────────────────────────────
// Smooth real-time search
// ─────────────────────────────────────

function handleSearch() {
  const input = document.getElementById("searchInput");
  if (!input) return;
  window.currentSearch = input.value.trim().toLowerCase();
  if (typeof applyFilters === "function") applyFilters();
}

// ─────────────────────────────────────
// Initialize on page load
// ─────────────────────────────────────

document.addEventListener("DOMContentLoaded", () => {

  // Set starting position instantly with no animation
  const track = document.querySelector(".hero-slides");
  if (track) {
    track.style.transition = "none";
    track.style.transform  = "translateX(0%)";

    // Enable animation after first frame
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        track.style.transition =
          `transform ${SLIDE_SPEED}ms cubic-bezier(0.645, 0.045, 0.355, 1.000)`;
      });
    });

    startAutoplay();
    initSwipe();
  }

  // Real-time smooth search with 300ms debounce
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      clearTimeout(searchInput._debounce);
      searchInput._debounce = setTimeout(() => {
        window.currentSearch = searchInput.value.trim().toLowerCase();
        if (typeof applyFilters === "function") applyFilters();
      }, 300);
    });

    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") handleSearch();
    });
  }

});