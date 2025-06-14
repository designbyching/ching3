// Ensure DOM is fully loaded before running scripts
document.addEventListener("DOMContentLoaded", () => {
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

    const navLinksItems = navLinks.querySelectorAll("a");
    navLinksItems.forEach((link) => {
      link.addEventListener("click", () => {
        console.log("Nav link clicked:", link.textContent);
        navLinks.classList.remove("active");
        navToggle.classList.remove("active");
        toggleText.textContent = "MENU";
      });
    });
  } else {
    console.warn("Navbar elements not found");
  }

  // Slideshow Functionality (for portfolio grid items)
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

    // Initialize state
    slideshow.__slideshowState = slideshow.__slideshowState || {
      current: 0,
      intervalId: null,
      listeners: [],
      isPaused: false,
      isTransitioning: false,
    };

    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let currentX = 0;
    let currentY = 0;
    const swipeThreshold = 50;

    // Show slide at index
    function showSlide(index) {
      if (slideshow.__slideshowState.isTransitioning) return;
      slideshow.__slideshowState.isTransitioning = true;

      // Normalize index
      index = ((index % slides.length) + slides.length) % slides.length;
      slides.forEach((slide) => {
        const slideImg = slide.querySelector(".slide-img");
        slide.classList.remove("active");
        if (slideImg) slideImg.classList.remove("active");
      });
      const activeSlide = slides[index];
      const activeSlideImg = activeSlide.querySelector(".slide-img");
      activeSlide.classList.add("active");
      if (activeSlideImg) activeSlideImg.classList.add("active");
      slideshow.__slideshowState.current = index;

      // Reset transition lock after CSS transition (0.5s)
      setTimeout(() => {
        slideshow.__slideshowState.isTransitioning = false;
      }, 500);

      console.log(
        "Switched to slide:",
        activeSlideImg ? activeSlideImg.src : activeSlide,
        "Index:",
        index
      );
    }

    // Initialize first slide
    if (
      !slides[slideshow.__slideshowState.current]?.classList.contains("active")
    ) {
      showSlide(slideshow.__slideshowState.current);
    }

    // Clear interval
    function clearIntervalIfExists() {
      if (slideshow.__slideshowState.intervalId) {
        clearInterval(slideshow.__slideshowState.intervalId);
        slideshow.__slideshowState.intervalId = null;
      }
    }

    // Start auto-advance
    function startInterval() {
      clearIntervalIfExists();
      if (!slideshow.__slideshowState.isPaused) {
        const intervalId = setInterval(() => {
          showSlide(slideshow.__slideshowState.current + 1);
        }, 2000);
        slideshow.__slideshowState.intervalId = intervalId;
        console.log("Slideshow interval started");
      }
    }

    // Pause slideshow
    function pauseSlideshow() {
      clearIntervalIfExists();
      slideshow.__slideshowState.isPaused = true;
      console.log("Slideshow paused");
    }

    // Resume slideshow
    function resumeSlideshow() {
      slideshow.__slideshowState.isPaused = false;
      startInterval();
      console.log("Slideshow resumed");
    }

    // Track event listeners
    function addTrackedListener(element, event, handler) {
      element.addEventListener(event, handler);
      slideshow.__slideshowState.listeners.push({ element, event, handler });
    }

    // Prev/Next button handlers
    const prevButton = slideshow.querySelector(".slideshow-prev");
    const nextButton = slideshow.querySelector(".slideshow-next");

    const handleButtonClick = (event, direction) => {
      event.stopPropagation();
      event.preventDefault();
      if (slideshow.__slideshowState.isTransitioning) return;
      pauseSlideshow();
      const newIndex =
        slideshow.__slideshowState.current + (direction === "prev" ? -1 : 1);
      showSlide(newIndex);
      resumeSlideshow();
      console.log(`Clicked ${direction} button, new index:`, newIndex);
    };

    if (prevButton) {
      addTrackedListener(prevButton, "click", (event) =>
        handleButtonClick(event, "prev")
      );
      addTrackedListener(prevButton, "touchstart", (event) =>
        handleButtonClick(event, "prev")
      );
    }

    if (nextButton) {
      addTrackedListener(nextButton, "click", (event) =>
        handleButtonClick(event, "next")
      );
      addTrackedListener(nextButton, "touchstart", (event) =>
        handleButtonClick(event, "next")
      );
    }

    // Touch events for swipe
    const handleTouchStart = (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      isDragging = true;
      pauseSlideshow();
      console.log("Touch started on portfolio slideshow");
    };

    const handleTouchMove = (e) => {
      if (!isDragging) return;
      currentX = e.touches[0].clientX;
      currentY = e.touches[0].clientY;
      const deltaX = Math.abs(startX - currentX);
      const deltaY = Math.abs(startY - currentY);
      if (deltaX > deltaY && deltaX > 10) {
        e.preventDefault();
      }
    };

    const handleTouchEnd = () => {
      if (!isDragging) return;
      isDragging = false;
      const deltaX = startX - currentX;
      if (Math.abs(deltaX) > swipeThreshold) {
        if (deltaX > 0) {
          showSlide(slideshow.__slideshowState.current + 1);
          console.log("Swiped left on portfolio slideshow");
        } else {
          showSlide(slideshow.__slideshowState.current - 1);
          console.log("Swiped right on portfolio slideshow");
        }
      }
      resumeSlideshow();
    };

    // Mouse events for drag
    const handleMouseDown = (e) => {
      startX = e.clientX;
      pauseSlideshow();
      isDragging = true;
      slideshow.style.cursor = "grabbing";
      console.log("Mouse drag started on portfolio slideshow");
      e.preventDefault();
    };

    const handleMouseMove = (e) => {
      if (!isDragging) return;
      currentX = e.clientX;
    };

    const handleMouseUp = () => {
      if (!isDragging) return;
      isDragging = false;
      slideshow.style.cursor = "grab";
      const deltaX = startX - currentX;
      if (Math.abs(deltaX) > swipeThreshold) {
        if (deltaX > 0) {
          showSlide(slideshow.__slideshowState.current + 1);
          console.log("Dragged left on portfolio slideshow");
        } else {
          showSlide(slideshow.__slideshowState.current - 1);
          console.log("Dragged right on portfolio slideshow");
        }
      }
      resumeSlideshow();
    };

    const handleMouseLeave = () => {
      if (isDragging) {
        isDragging = false;
        slideshow.style.cursor = "grab";
        resumeSlideshow();
      }
    };

    // Add tracked listeners
    addTrackedListener(slideshow, "touchstart", handleTouchStart);
    addTrackedListener(slideshow, "touchmove", handleTouchMove);
    addTrackedListener(slideshow, "touchend", handleTouchEnd);
    addTrackedListener(slideshow, "mousedown", handleMouseDown);
    addTrackedListener(slideshow, "mousemove", handleMouseMove);
    addTrackedListener(slideshow, "mouseup", handleMouseUp);
    addTrackedListener(slideshow, "mouseleave", handleMouseLeave);

    // Set initial cursor
    slideshow.style.cursor = "grab";

    // Start the slideshow
    startInterval();
  }

  function stopSlideshow(slideshow, slideSelector = ".slide") {
    if (!slideshow) {
      console.error("Slideshow element not found");
      return;
    }
    const slides = slideshow.querySelectorAll(slideSelector);

    // Clear interval
    if (slideshow.__slideshowState?.intervalId) {
      clearInterval(slideshow.__slideshowState.intervalId);
    }

    // Remove all event listeners
    if (slideshow.__slideshowState?.listeners) {
      slideshow.__slideshowState.listeners.forEach(
        ({ element, event, handler }) => {
          element.removeEventListener(event, handler);
        }
      );
    }

    // Reset state
    slides.forEach((slide) => {
      const slideImg = slide.querySelector(".slide-img");
      slide.classList.remove("active");
      if (slideImg) slideImg.classList.remove("active");
    });
    slideshow.__slideshowState = {
      current: 0,
      intervalId: null,
      listeners: [],
      isPaused: false,
      isTransitioning: false,
    };
    console.log("Slideshow stopped and reset");
  }

  // Portfolio Toggle and Slideshow
  const gridItems = document.querySelectorAll(".grid-item");
  if (gridItems.length > 0) {
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

          // Stop slideshows for all other expanded cards
          gridItems.forEach((i) => {
            if (i !== item && i.classList.contains("expanded")) {
              const otherSlideshow = i.querySelector(".slideshow");
              if (otherSlideshow) {
                stopSlideshow(otherSlideshow, ".slide");
              }
              i.classList.remove("expanded");
            }
          });

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
  } else {
    console.warn("No grid items found");
  }

  // Portfolio Filter
  const filterButtons = document.querySelectorAll(".filter-button");
  if (filterButtons.length > 0) {
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
    console.warn("No filter buttons found");
  }

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
      console.log("Contact form submitted:", "");
      const name = contactForm.querySelector("#name")?.value.trim();
      const email = contactForm.querySelector("#email")?.value?.trim();
      const message = contactForm.querySelector("#message")?.value.trim();
      const service = contactForm.querySelector(
        'input[name="service"]:checked'
      );
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
  const themeToggle = document.querySelector("#toggle");
  if (themeToggle) {
    const savedMode = localStorage.getItem("theme-mode");
    if (savedMode === "night") {
      document.body.classList.add("night-mode");
      themeToggle.checked = true;
    }

    themeToggle.addEventListener("change", () => {
      console.log(
        "Theme toggle changed:",
        themeToggle.checked ? "night" : "day"
      );
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
  const wordCycle = document.querySelector(".word-cycle");
  if (wordCycle) {
    const words = ["UNFORGETTABLE.", "CONNECT.", "LAST."];
    let currentIndex = 0;
    let isFirstLoad = true;

    function typeWord(text, callback) {
      let i = 0;
      wordCycle.textContent = "";
      wordCycle.classList.add("typing");
      const typeInterval = setInterval(() => {
        if (i < text.length) {
          wordCycle.textContent += text[i];
          i++;
        } else {
          clearInterval(typeInterval);
          callback();
        }
      }, 100);
    }

    function deleteWord(text, callback) {
      let i = text.length;
      const deleteInterval = setInterval(() => {
        if (i > 0) {
          wordCycle.textContent = text.substring(0, i - 1);
          i--;
        } else {
          clearInterval(deleteInterval);
          wordCycle.classList.remove("typing");
          callback();
        }
      }, 100);
    }

    function animateWord() {
      if (isFirstLoad) {
        isFirstLoad = false;
        setTimeout(() => {
          typeWord("LAST.", () => {
            setTimeout(() => {
              deleteWord("LAST.", () => {
                cycleWords();
              });
            }, 3000);
          });
        }, 1000);
        return;
      }

      const currentWord = words[currentIndex];
      typeWord(currentWord, () => {
        setTimeout(() => {
          deleteWord(currentWord, () => {
            currentIndex = (currentIndex + 1) % words.length;
            cycleWords();
          });
        }, 1500);
      });
    }

    function cycleWords() {
      setTimeout(() => {
        animateWord();
      }, 100);
    }

    animateWord();
  }

  // Mobile touch/click effect for testimonial cards
  const testimonialCards = document.querySelectorAll(".testimonial-card");
  testimonialCards.forEach((card) => {
    card.addEventListener("click", () => {
      console.log("Testimonial card tapped:", card.className);
      if (card.classList.contains("active")) {
        card.classList.remove("active");
      } else {
        testimonialCards.forEach((c) => c.classList.remove("active"));
        card.classList.add("active");
        setTimeout(() => {
          card.classList.remove("active");
        }, 1000);
      }
    });
  });

  // Service Section Fade-In Animation
  const serviceSections = document.querySelectorAll(".service-section");
  if (serviceSections.length > 0) {
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
  }

  // Multiple Project and Service Slideshows
  const slideshows = document.querySelectorAll(
    ".project-slideshow, .service-slideshow"
  );
  slideshows.forEach((slideshow, slideshowIndex) => {
    const isServiceSlideshow =
      slideshow.classList.contains("service-slideshow");
    const slideSelector = isServiceSlideshow
      ? ".service-slide"
      : ".project-slide";
    const slides = slideshow.querySelectorAll(slideSelector);
    const dots = slideshow.querySelectorAll(".slideshow-dots .dot");
    let currentIndex = 0;
    let intervalId = null;
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let currentX = 0;
    let currentY = 0;
    const swipeThreshold = 50;

    function showSlide(index) {
      if (index >= slides.length) index = 0;
      if (index < 0) index = slides.length - 1;
      slides.forEach((slide, i) =>
        slide.classList.toggle("active", i === index)
      );
      dots.forEach((dot, i) => dot.classList.toggle("active", i === index));
      currentIndex = index;
      console.log(
        `${isServiceSlideshow ? "Service" : "Project"} slideshow ${
          slideshowIndex + 1
        } showing slide ${index + 1}`
      );
    }

    function startSlideshow() {
      intervalId = setInterval(() => {
        showSlide(currentIndex + 1);
      }, 3000);
    }

    function pauseSlideshow() {
      clearInterval(intervalId);
    }

    function resumeSlideshow() {
      pauseSlideshow();
      startSlideshow();
    }

    dots.forEach((dot, index) => {
      dot.addEventListener("click", (e) => {
        e.stopPropagation();
        pauseSlideshow();
        showSlide(index);
        resumeSlideshow();
      });
    });

    slideshow.addEventListener("touchstart", (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      isDragging = true;
      pauseSlideshow();
    });

    slideshow.addEventListener("touchmove", (e) => {
      if (!isDragging) return;
      currentX = e.touches[0].clientX;
      currentY = e.touches[0].clientY;
      const deltaX = Math.abs(startX - currentX);
      const deltaY = Math.abs(startY - currentY);
      if (deltaX > deltaY && deltaX > 10) {
        e.preventDefault();
      }
    });

    slideshow.addEventListener("touchend", () => {
      if (!isDragging) return;
      isDragging = false;
      const deltaX = startX - currentX;
      if (Math.abs(deltaX) > swipeThreshold) {
        if (deltaX > 0) {
          showSlide(currentIndex + 1);
        } else {
          showSlide(currentIndex - 1);
        }
      }
      resumeSlideshow();
    });

    slideshow.addEventListener("mousedown", (e) => {
      startX = e.clientX;
      isDragging = true;
      pauseSlideshow();
      slideshow.style.cursor = "grabbing";
      e.preventDefault();
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
          showSlide(currentIndex + 1);
        } else {
          showSlide(currentIndex - 1);
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

    slideshow.addEventListener("click", (e) => {
      if (e.target.closest(".dot")) return;
      e.stopPropagation();
    });

    showSlide(0);
    startSlideshow();
    slideshow.style.cursor = "grab";
  });

  // Video Container Click-to-Play
  const videoContainers = document.querySelectorAll(".video-container");
  videoContainers.forEach((container) => {
    const videoId = container.dataset.videoId;
    if (!videoId) {
      console.error("No video ID found for video container", container);
      return;
    }

    container.addEventListener("click", () => {
      console.log(`Video container clicked, loading video ID: ${videoId}`);
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
      container.style.cursor = "default";
    });
  });

  // Intersection Observer for intro testimonials animation
  const introTestimonials = document.querySelector(".intro-testimonials");
  const testimonialCircles = document.querySelectorAll(".testimonial-circle");
  const happyClients = document.querySelector(".happy-clients");
  const happyClientsNumber = document.querySelector(".happy-clients-number");

  if (introTestimonials && happyClients && happyClientsNumber) {
    function animateCountUp(element, target, duration) {
      let start = 0;
      const increment = target / (duration / 16);
      const startTime = performance.now();

      function updateCount(timestamp) {
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const current = Math.floor(progress * target);
        element.textContent = current;
        if (progress < 1) {
          requestAnimationFrame(updateCount);
        } else {
          element.textContent = target;
        }
      }

      requestAnimationFrame(updateCount);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            testimonialCircles.forEach((circle, index) => {
              setTimeout(() => {
                circle.classList.add("animate");
              }, index * 200);
            });

            const circleAnimationDelay = testimonialCircles.length * 200;
            setTimeout(() => {
              happyClients.classList.add("animate");
              const targetNumber = parseInt(
                happyClientsNumber.getAttribute("data-target"),
                10
              );
              animateCountUp(happyClientsNumber, targetNumber, 1500);
            }, circleAnimationDelay);

            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(introTestimonials);
  }
});
