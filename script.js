// Navbar Toggle
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
const toggleText = document.querySelector(".toggle-text");

if (navToggle && navLinks && toggleText) {
  navToggle.addEventListener("click", () => {
    console.log("Navbar toggle clicked"); // Debug
    navLinks.classList.toggle("active");
    navToggle.classList.toggle("active");
    // Swap MENU/CLOSE text
    toggleText.textContent = navLinks.classList.contains("active")
      ? "CLOSE"
      : "MENU";
  });

  // Close mobile nav on link click
  const navLinksItems = document.querySelectorAll(".nav-links a");
  navLinksItems.forEach((link) => {
    link.addEventListener("click", () => {
      console.log("Nav link clicked:", link.textContent); // Debug
      navLinks.classList.remove("active");
      navToggle.classList.remove("active");
      toggleText.textContent = "MENU";
    });
  });
}

// Slideshow Functionality
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

  // Show first slide
  slides[current].classList.add("active");
  console.log("First slide activated:", slides[current].src);

  // Function to switch to a specific slide
  function showSlide(index) {
    slides[current].classList.remove("active");
    current = (index + slides.length) % slides.length; // Ensure index stays in bounds
    slides[current].classList.add("active");
    console.log("Switched to slide:", slides[current].src);
  }

  // Start interval
  let intervalId = setInterval(() => {
    showSlide(current + 1);
  }, 3000);
  slideshow.dataset.interval = intervalId.toString();

  // Add button event listeners
  const prevButton = slideshow.querySelector(".slideshow-prev");
  const nextButton = slideshow.querySelector(".slideshow-next");

  const handleButtonClick = (event, direction) => {
    event.stopPropagation(); // Stop bubbling to .grid-item
    event.preventDefault(); // Prevent default behavior
    clearInterval(Number(slideshow.dataset.interval)); // Pause slideshow
    showSlide(direction === "prev" ? current - 1 : current + 1);
    slideshow.dataset.interval = setInterval(() => {
      showSlide(current + 1);
    }, 3000).toString(); // Resume slideshow
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
  console.log("Filtering by category:", category); // Debug
  gridItems.forEach((item) => {
    const slideshow = item.querySelector(".slideshow");
    // Stop slideshow and collapse if expanded
    if (item.classList.contains("expanded")) {
      item.classList.remove("expanded");
      if (slideshow) {
        stopSlideshow(slideshow, ".slide");
      }
    }

    // Show/hide based on category
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
      console.log("Filter button clicked:", button.dataset.filter); // Debug
      // Update active button and ARIA
      filterButtons.forEach((btn) => {
        btn.classList.remove("active");
        btn.setAttribute("aria-pressed", "false");
      });
      button.classList.add("active");
      button.setAttribute("aria-pressed", "true");

      // Filter portfolio
      const category = button.dataset.filter;
      filterPortfolio(category);
    });

    // Keyboard accessibility
    button.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        console.log(
          "Filter button activated via keyboard:",
          button.dataset.filter
        ); // Debug
        button.click();
      }
    });
  });

  // Initialize with "All" filter
  filterPortfolio("all");
} else {
  console.warn("No filter buttons found on this page"); // Debug
}

// Portfolio Toggle and Slideshow
gridItems.forEach((item) => {
  item.addEventListener("click", (event) => {
    console.log(
      "Grid item clicked:",
      item.dataset.project,
      "Target:",
      event.target.tagName,
      event.target.className
    ); // Debug
    const link = event.target.closest("a");
    if (link) {
      event.stopPropagation(); // Prevent card toggle when clicking links
      return; // Allow link navigation
    }

    const slideshow = item.querySelector(".slideshow");
    if (!slideshow) {
      console.log("No slideshow found for", item.dataset.project);
      return; // Skip if no slideshow
    }

    // Toggle expanded state
    gridItems.forEach((i) => i !== item && i.classList.remove("expanded"));
    item.classList.toggle("expanded");

    // Start or stop slideshow
    if (item.classList.contains("expanded")) {
      console.log("Starting slideshow for", item.dataset.project);
      startSlideshow(slideshow, ".slide");
    } else {
      console.log("Stopping slideshow for", item.dataset.project);
      stopSlideshow(slideshow, ".slide");
    }
  });
});

// Project Page Slideshow
document.addEventListener("DOMContentLoaded", () => {
  const projectSlideshow = document.querySelector(".project-slideshow");
  if (projectSlideshow) {
    console.log("Initializing project slideshow");
    startSlideshow(projectSlideshow, ".project-slide");
  }
});

// Smooth Scroll for Back to Top
const backToTop = document.querySelector(".back-to-top");
if (backToTop) {
  backToTop.addEventListener("click", (e) => {
    e.preventDefault();
    console.log("Back to top clicked"); // Debug
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
    console.log("Contact form submitted"); // Debug
    const name = contactForm.querySelector("#name").value.trim();
    const email = contactForm.querySelector("#email").value.trim();
    const message = contactForm.querySelector("#message").value.trim();
    const service = contactForm.querySelector('input[name="service"]:checked');
    const businessSize = contactForm.querySelector(
      'input[name="business-size"]:checked'
    );

    // Check required fields
    if (!name || !email || !message || !service || !businessSize) {
      e.preventDefault();
      alert(
        "Please fill out all required fields: Name, Email, Service Type, Business Size, and Project Details."
      );
      return;
    }

    // Basic email validation
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
  // Load saved mode on page load
  const savedMode = localStorage.getItem("theme-mode");
  if (savedMode === "night") {
    document.body.classList.add("night-mode");
    themeToggle.checked = true;
  }

  // Toggle mode on change
  themeToggle.addEventListener("change", () => {
    console.log("Theme toggle changed:", themeToggle.checked ? "night" : "day"); // Debug
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
    // Add fade class to start fading out
    wordCycle.classList.add("fade");

    setTimeout(() => {
      // Change the word after fade-out
      wordCycle.textContent = words[currentIndex];
      // Remove fade class to fade in
      wordCycle.classList.remove("fade");
      // Move to next word, loop back to 0 if at the end
      currentIndex = (currentIndex + 1) % words.length;
    }, 500); // Matches CSS transition duration (0.5s)
  }

  // Initial delay of 3 seconds for "IMPACT"
  setTimeout(() => {
    // Start cycling every 2 seconds after initial delay
    changeWord(); // First change
    setInterval(changeWord, 2000); // Subsequent changes every 2 seconds
  }, 3000);
});

// Mobile touch/click effect for service and testimonial cards
document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".service-card, .testimonial-card");

  cards.forEach((card) => {
    card.addEventListener("click", (event) => {
      console.log("Card tapped:", card.className); // Debug
      // Toggle active class
      if (card.classList.contains("active")) {
        card.classList.remove("active");
      } else {
        // Remove active from all cards to prevent multiple active states
        cards.forEach((c) => c.classList.remove("active"));
        card.classList.add("active");

        // Remove active class after 1 second for natural effect
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
