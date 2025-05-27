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

  slides[current].classList.add("active");
  console.log("First slide activated:", slides[current].src);

  function showSlide(index) {
    slides[current].classList.remove("active");
    current = (index + slides.length) % slides.length;
    slides[current].classList.add("active");
    console.log("Switched to slide:", slides[current].src);
  }

  let intervalId = setInterval(() => {
    showSlide(current + 1);
  }, 3000);
  slideshow.dataset.interval = intervalId.toString();

  const prevButton = slideshow.querySelector(".slideshow-prev");
  const nextButton = slideshow.querySelector(".slideshow-next");

  const handleButtonClick = (event, direction) => {
    event.stopPropagation();
    event.preventDefault();
    clearInterval(Number(slideshow.dataset.interval));
    showSlide(direction === "prev" ? current - 1 : current + 1);
    slideshow.dataset.interval = setInterval(() => {
      showSlide(current + 1);
    }, 3000).toString();
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

// Project Page Slideshow
document.addEventListener("DOMContentLoaded", () => {
  const projectSlideshow = document.querySelector(".project-slideshow");
  if (!projectSlideshow) {
    console.log("No project slideshow found on this page");
    return;
  }

  const projectSlides = projectSlideshow.querySelectorAll(".project-slide");
  if (projectSlides.length === 0) {
    console.error("No slides found in project slideshow");
    return;
  }

  const playPauseButton = projectSlideshow.querySelector(
    ".slideshow-play-pause"
  );
  const dots = projectSlideshow.querySelectorAll(".slideshow-dots .dot");
  let projectCurrent = 0;
  let isProjectPlaying = false;
  let projectIntervalId = null;

  // Initialize first slide and dot
  projectSlides[projectCurrent].classList.add("active");
  dots[projectCurrent].classList.add("active");
  console.log(
    "Project slideshow initialized, first slide:",
    projectSlides[projectCurrent].src
  );

  // Show specific slide
  function showProjectSlide(index) {
    projectSlides[projectCurrent].classList.remove("active");
    dots[projectCurrent].classList.remove("active");
    projectCurrent = (index + projectSlides.length) % projectSlides.length;
    projectSlides[projectCurrent].classList.add("active");
    dots[projectCurrent].classList.add("active");
    console.log(
      "Switched to project slide:",
      projectSlides[projectCurrent].src
    );
  }

  // Start slideshow
  function startProjectSlideshow() {
    if (isProjectPlaying) return;
    isProjectPlaying = true;
    playPauseButton.classList.remove("paused"); // Remove .paused when playing (shows ❚❚)
    projectIntervalId = setInterval(() => {
      showProjectSlide(projectCurrent + 1);
    }, 3000);
    console.log("Project slideshow started");
  }

  // Stop slideshow
  function stopProjectSlideshow() {
    if (!isProjectPlaying) return;
    isProjectPlaying = false;
    playPauseButton.classList.add("paused"); // Add .paused when paused (shows ▶)
    clearInterval(projectIntervalId);
    console.log("Project slideshow paused");
  }

  // Play/Pause button handler
  if (playPauseButton) {
    playPauseButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      console.log(
        "Play/Pause clicked, current state:",
        isProjectPlaying ? "playing" : "paused"
      );
      if (isProjectPlaying) {
        stopProjectSlideshow();
      } else {
        startProjectSlideshow();
      }
    });
    playPauseButton.addEventListener("touchstart", (event) => {
      event.preventDefault();
      event.stopPropagation();
      console.log("Play/Pause touched");
      if (isProjectPlaying) {
        stopProjectSlideshow();
      } else {
        startProjectSlideshow();
      }
    });
  }

  // Dot navigation
  dots.forEach((dot, index) => {
    dot.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      console.log("Dot clicked, index:", index);
      if (index !== projectCurrent) {
        showProjectSlide(index);
        if (isProjectPlaying) {
          stopProjectSlideshow();
          startProjectSlideshow(); // Restart slideshow
        }
      }
    });
  });

  // Initialize paused state
  playPauseButton.classList.add("paused"); // Start paused, show ▶
  console.log("Project slideshow initialized in paused state");
});
