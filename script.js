// Navbar Toggle
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
const toggleText = document.querySelector(".toggle-text");

if (navToggle && navLinks && toggleText) {
  navToggle.addEventListener("click", () => {
    console.log("Navbar toggle clicked");
    navLinks.classList.toggle("active");
    navToggle.classList.toggle("active");
    toggleText.textContent = navLinks.classList.contains("active")
      ? "CLOSE"
      : "MENU";
  });

  const navLinksItems = document.querySelectorAll(".nav-links a");
  navLinksItems.forEach((link) => {
    link.addEventListener("click", () => {
      console.log("Nav link clicked:", link.textContent);
      navLinks.classList.remove("active");
      navToggle.classList.remove("active");
      toggleText.textContent = "MENU";
    });
  });
}

// Slideshow Functionality (for index.html)
function startSlideshow(slideshow, slideSelector = ".slide") {
  if (!slideshow) {
    console.error("Slideshow element not found");
    return;
  }
  const slides = slideshow.querySelectorAll(slideSelector);
  if (slides.length === 0) {
    console.error("No slides found in slideshow");
    return;
  }
  let current = 0;
  let isDragging = false;
  let startX = 0;
  let currentX = 0;
  const swipeThreshold = 50; // Min pixels to trigger slide change

  // Show slide at index
  function showSlide(index) {
    slides[current].classList.remove("active");
    current = (index + slides.length) % slides.length;
    slides[current].classList.add("active");
    console.log("Switched to slide:", slides[current].src);
  }

  // Initialize first slide
  slides[current].classList.add("active");
  console.log("First slide activated:", slides[current].src);

  // Start auto-advance
  let intervalId = setInterval(() => {
    showSlide(current + 1);
  }, 2000);
  slideshow.dataset.interval = intervalId.toString();

  // Pause slideshow
  function pauseSlideshow() {
    clearInterval(Number(slideshow.dataset.interval));
    delete slideshow.dataset.interval;
  }

  // Resume slideshow
  function resumeSlideshow() {
    pauseSlideshow(); // Clear any existing interval
    intervalId = setInterval(() => {
      showSlide(current + 1);
    }, 2000);
    slideshow.dataset.interval = intervalId.toString();
  }

  // Prev/Next button handlers
  const prevButton = slideshow.querySelector(".slideshow-prev");
  const nextButton = slideshow.querySelector(".slideshow-next");

  const handleButtonClick = (event, direction) => {
    event.stopPropagation();
    event.preventDefault();
    pauseSlideshow();
    showSlide(direction === "prev" ? current - 1 : current + 1);
    resumeSlideshow();
  };

  if (prevButton) {
    prevButton.addEventListener("click", (event) =>
      handleButtonClick(event, "prev")
    );
    prevButton.addEventListener("touchstart", (event) =>
      handleButtonClick(event, "prev")
    );
  }

  if (nextButton) {
    nextButton.addEventListener("click", (event) =>
      handleButtonClick(event, "next")
    );
    nextButton.addEventListener("touchstart", (event) =>
      handleButtonClick(event, "next")
    );
  }

  // Touch events for swipe
  slideshow.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
    pauseSlideshow();
    isDragging = true;
    console.log("Touch started on portfolio slideshow");
  });

  slideshow.addEventListener("touchmove", (e) => {
    if (!isDragging) return;
    currentX = e.touches[0].clientX;
    e.preventDefault(); // Prevent scrolling during swipe
  });

  slideshow.addEventListener("touchend", () => {
    if (!isDragging) return;
    isDragging = false;
    const deltaX = startX - currentX;
    if (Math.abs(deltaX) > swipeThreshold) {
      if (deltaX > 0) {
        // Swipe left (next)
        showSlide(current + 1);
        console.log("Swiped left on portfolio slideshow");
      } else {
        // Swipe right (previous)
        showSlide(current - 1);
        console.log("Swiped right on portfolio slideshow");
      }
    }
    resumeSlideshow(); // Resume auto-advance
  });

  // Mouse events for drag
  slideshow.addEventListener("mousedown", (e) => {
    startX = e.clientX;
    pauseSlideshow();
    isDragging = true;
    slideshow.style.cursor = "grabbing";
    console.log("Mouse drag started on portfolio slideshow");
    e.preventDefault(); // Prevent text selection
  });

  slideshow.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    currentX = e.clientX;
  });

  slideshow.addEventListener("mouseup", () => {
    if (!isDragging) return;
    isDragging = false;
    slideshow.style.cursor = "grab";
    const deltaX = startX - currentX;
    if (Math.abs(deltaX) > swipeThreshold) {
      if (deltaX > 0) {
        // Drag left (next)
        showSlide(current + 1);
        console.log("Dragged left on portfolio slideshow");
      } else {
        // Drag right (previous)
        showSlide(current - 1);
        console.log("Dragged right on portfolio slideshow");
      }
    }
    resumeSlideshow(); // Resume auto-advance
  });

  slideshow.addEventListener("mouseleave", () => {
    if (isDragging) {
      isDragging = false;
      slideshow.style.cursor = "grab";
      resumeSlideshow();
    }
  });

  // Set initial cursor
  slideshow.style.cursor = "grab";
}

function stopSlideshow(slideshow, slideSelector = ".slide") {
  if (!slideshow) {
    console.error("Slideshow element not found");
    return;
  }
  const slides = slideshow.querySelectorAll(slideSelector);
  if (slideshow.dataset.interval) {
    clearInterval(Number(slideshow.dataset.interval));
    delete slideshow.dataset.interval;
  }
  slides.forEach((slide) => slide.classList.remove("active"));
  console.log("Slideshow stopped");
}

// Portfolio Filter
const filterButtons = document.querySelectorAll(".filter-button");
const gridItems = document.querySelectorAll(".grid-item");

function filterPortfolio(category) {
  console.log("Filtering by category:", category);
  gridItems.forEach((item) => {
    const slideshow = item.querySelector(".slideshow");
    if (item.classList.contains("expanded")) {
      item.classList.remove("expanded");
      if (slideshow) {
        stopSlideshow(slideshow, ".slide");
      }
    }

    if (category === "all" || item.dataset.category === category) {
      item.classList.remove("hidden");
    } else {
      item.classList.add("hidden");
    }
  });
}

if (filterButtons.length > 0) {
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      console.log("Filter button clicked:", button.dataset.filter);
      filterButtons.forEach((btn) => {
        btn.classList.remove("active");
        btn.setAttribute("aria-pressed", "false");
      });
      button.classList.add("active");
      button.setAttribute("aria-pressed", "true");

      const category = button.dataset.filter;
      filterPortfolio(category);
    });

    button.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        console.log(
          "Filter button activated via keyboard:",
          button.dataset.filter
        );
        button.click();
      }
    });
  });

  filterPortfolio("all");
} else {
  console.warn("No filter buttons found on this page");
}

// Portfolio Toggle and Slideshow
gridItems.forEach((item) => {
  item.addEventListener("click", (event) => {
    const target = event.target;
    const link = target.closest("a");
    const isNavButton = target.closest(".slideshow-prev, .slideshow-next");
    const isCollapseToggle = target.closest(".toggle-collapse");

    console.log(
      "Grid item clicked:",
      item.dataset.project,
      "Target:",
      target.tagName,
      target.className
    );

    if (link || isNavButton || isCollapseToggle) {
      event.stopPropagation();
      return;
    }

    if (!item.classList.contains("expanded")) {
      const slideshow = item.querySelector(".slideshow");
      if (!slideshow) {
        console.log("No slideshow found for", item.dataset.project);
        return;
      }

      const expandToggle = item.querySelector(".toggle-expand");
      if (expandToggle) {
        expandToggle.classList.add("highlight");
        setTimeout(() => {
          expandToggle.classList.remove("highlight");
        }, 300);
      }

      gridItems.forEach((i) => i !== item && i.classList.remove("expanded"));
      item.classList.add("expanded");

      console.log("Starting slideshow for", item.dataset.project);
      startSlideshow(slideshow, ".slide");
    }
  });

  const collapseToggle = item.querySelector(".toggle-collapse");
  if (collapseToggle) {
    collapseToggle.addEventListener("click", (event) => {
      event.stopPropagation();
      console.log("Collapse toggle clicked for", item.dataset.project);

      collapseToggle.classList.add("highlight");
      setTimeout(() => {
        collapseToggle.classList.remove("highlight");
      }, 300);

      const slideshow = item.querySelector(".slideshow");
      if (slideshow) {
        stopSlideshow(slideshow, ".slide");
      }
      item.classList.remove("expanded");
    });
  }
});

// Smooth Scroll for Back to Top
const backToTop = document.querySelector(".back-to-top");
if (backToTop) {
  backToTop.addEventListener("click", (e) => {
    e.preventDefault();
    console.log("Back to top clicked");
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

// Form Validation
const contactForm = document.querySelector(".contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    console.log("Contact form submitted");
    const name = contactForm.querySelector("#name").value.trim();
    const email = contactForm.querySelector("#email").value.trim();
    const message = contactForm.querySelector("#message").value.trim();
    const service = contactForm.querySelector('input[name="service"]:checked');
    const businessSize = contactForm.querySelector(
      'input[name="business-size"]:checked'
    );

    if (!name || !email || !message || !service || !businessSize) {
      e.preventDefault();
      alert(
        "Please fill out all required fields: Name, Email, Service Type, Business Size, and Project Details."
      );
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      e.preventDefault();
      alert("Please enter a valid email address.");
    }
  });
}

// Theme Toggle
const themeToggle = document.getElementById("toggle");
if (themeToggle) {
  const savedMode = localStorage.getItem("theme-mode");
  if (savedMode === "night") {
    document.body.classList.add("night-mode");
    themeToggle.checked = true;
  }

  themeToggle.addEventListener("change", () => {
    console.log("Theme toggle changed:", themeToggle.checked ? "night" : "day");
    if (themeToggle.checked) {
      document.body.classList.add("night-mode");
      localStorage.setItem("theme-mode", "night");
    } else {
      document.body.classList.remove("night-mode");
      localStorage.setItem("theme-mode", "day");
    }
  });
}

// Word Cycle Animation
document.addEventListener("DOMContentLoaded", () => {
  const wordCycle = document.querySelector(".word-cycle");
  if (!wordCycle) {
    console.error("Word cycle element not found");
    return;
  }

  const words = [
    "TRANSFORM BRANDS",
    "TURN HEADS",
    "DISRUPT MARKETS",
    "THINK BRAVE",
    "CONNECT THE DOTS",
    "CRACK THE CODE",
    "IMPACT",
  ];
  let currentIndex = 0;

  function changeWord() {
    wordCycle.classList.add("fade");
    setTimeout(() => {
      wordCycle.textContent = words[currentIndex];
      wordCycle.classList.remove("fade");
      currentIndex = (currentIndex + 1) % words.length;
    }, 500);
  }

  setTimeout(() => {
    changeWord();
    setInterval(changeWord, 2000);
  }, 3000);
});

// Mobile touch/click effect for service and testimonial cards
document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".service-card, .testimonial-card");
  cards.forEach((card) => {
    card.addEventListener("click", () => {
      console.log("Card tapped:", card.className);
      if (card.classList.contains("active")) {
        card.classList.remove("active");
      } else {
        cards.forEach((c) => c.classList.remove("active"));
        card.classList.add("active");
        setTimeout(() => {
          card.classList.remove("active");
        }, 1000);
      }
    });
  });
});

// Service Section Fade-In Animation
document.addEventListener("DOMContentLoaded", () => {
  const serviceSections = document.querySelectorAll(".service-section");
  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  serviceSections.forEach((section) => {
    observer.observe(section);
  });
});

// Multiple Project Slideshows
document.addEventListener("DOMContentLoaded", () => {
  // Initialize all slideshows
  const slideshows = document.querySelectorAll(".project-slideshow");
  slideshows.forEach((slideshow, slideshowIndex) => {
    const slides = slideshow.querySelectorAll(".project-slide");
    const dots = slideshow.querySelectorAll(".slideshow-dots .dot");
    let currentIndex = 0;
    let intervalId = null;
    let isDragging = false;
    let startX = 0;
    let startY = 0; // Track vertical start position
    let currentX = 0;
    let currentY = 0; // Track vertical current position
    const swipeThreshold = 50; // Min pixels to trigger slide change

    // Show slide at index
    function showSlide(index) {
      if (index >= slides.length) index = 0;
      if (index < 0) index = slides.length - 1;
      slides.forEach((slide, i) => {
        slide.classList.toggle("active", i === index);
      });
      dots.forEach((dot, i) => {
        dot.classList.toggle("active", i === index);
      });
      currentIndex = index;
      console.log(
        `Slideshow ${slideshowIndex + 1} showing slide ${currentIndex}`
      );
    }

    // Start slideshow
    function startSlideshow() {
      intervalId = setInterval(() => {
        showSlide(currentIndex + 1);
      }, 3000);
      console.log(`Slideshow ${slideshowIndex + 1} started`);
    }

    // Pause slideshow temporarily for interactions
    function pauseSlideshow() {
      clearInterval(intervalId);
      console.log(`Slideshow ${slideshowIndex + 1} paused temporarily`);
    }

    // Resume slideshow
    function resumeSlideshow() {
      pauseSlideshow(); // Clear existing interval
      startSlideshow();
    }

    // Dot navigation
    dots.forEach((dot, index) => {
      dot.addEventListener("click", (e) => {
        e.stopPropagation();
        pauseSlideshow();
        showSlide(index);
        resumeSlideshow();
        console.log(
          `Slideshow ${slideshowIndex + 1} dot clicked, index: ${index}`
        );
      });
    });

    // Touch events for swipe
    slideshow.addEventListener("touchstart", (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY; // Capture vertical position
      isDragging = true;
      pauseSlideshow();
      console.log(`Slideshow ${slideshowIndex + 1} touch started`);
    });

    slideshow.addEventListener("touchmove", (e) => {
      if (!isDragging) return;
      currentX = e.touches[0].clientX;
      currentY = e.touches[0].clientY; // Track vertical position
      const deltaX = Math.abs(startX - currentX);
      const deltaY = Math.abs(startY - currentY);
      // Only prevent default if horizontal movement dominates (swipe)
      if (deltaX > deltaY && deltaX > 10) {
        // Threshold to avoid jitter
        e.preventDefault(); // Block scrolling for horizontal swipe
      }
    });

    slideshow.addEventListener("touchend", () => {
      if (!isDragging) return;
      isDragging = false;
      const deltaX = startX - currentX;
      // Only trigger slide change if horizontal movement exceeds threshold
      if (Math.abs(deltaX) > swipeThreshold) {
        if (deltaX > 0) {
          // Swipe left (next)
          showSlide(currentIndex + 1);
          console.log(`Slideshow ${slideshowIndex + 1} swiped left`);
        } else {
          // Swipe right (previous)
          showSlide(currentIndex - 1);
          console.log(`Slideshow ${slideshowIndex + 1} swiped right`);
        }
      }
      resumeSlideshow();
    });

    // Mouse events for drag
    slideshow.addEventListener("mousedown", (e) => {
      startX = e.clientX;
      isDragging = true;
      pauseSlideshow();
      slideshow.style.cursor = "grabbing";
      console.log(`Slideshow ${slideshowIndex + 1} mouse drag started`);
      e.preventDefault(); // Prevent text selection
    });

    slideshow.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      currentX = e.clientX;
    });

    slideshow.addEventListener("mouseup", () => {
      if (!isDragging) return;
      isDragging = false;
      slideshow.style.cursor = "grab";
      const deltaX = startX - currentX;
      if (Math.abs(deltaX) > swipeThreshold) {
        if (deltaX > 0) {
          // Drag left (next)
          showSlide(currentIndex + 1);
          console.log(`Slideshow ${slideshowIndex + 1} dragged left`);
        } else {
          // Drag right (previous)
          showSlide(currentIndex - 1);
          console.log(`Slideshow ${slideshowIndex + 1} dragged right`);
        }
      }
      resumeSlideshow();
    });

    slideshow.addEventListener("mouseleave", () => {
      if (isDragging) {
        isDragging = false;
        slideshow.style.cursor = "grab";
        resumeSlideshow();
      }
    });

    // Prevent unintended clicks on images
    slideshow.addEventListener("click", (e) => {
      if (e.target.closest(".dot")) {
        return;
      }
      e.stopPropagation();
    });

    // Initialize
    showSlide(currentIndex);
    startSlideshow(); // Start auto immediately
    slideshow.style.cursor = "grab";
    console.log(`Slideshow ${slideshowIndex + 1} initialized`);
  });
});

// Video Container Click-to-Play
document.addEventListener("DOMContentLoaded", () => {
  const videoContainers = document.querySelectorAll(".video-container");
  videoContainers.forEach((container) => {
    const videoId = container.dataset.videoId;
    if (!videoId) {
      console.error("No video ID found for video container", container);
      return;
    }

    container.addEventListener("click", () => {
      console.log(`Video container clicked, loading video ID: ${videoId}`);
      // Replace cover with iframe
      container.innerHTML = `
        <iframe
          class="video-iframe"
          src="https://www.youtube.com/embed/${videoId}?autoplay=1"
          title="Video Content"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
      `;
      // Remove cursor pointer since video is now loaded
      container.style.cursor = "default";
    });
  });
});
