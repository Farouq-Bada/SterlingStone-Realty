// ==================== PAGE LOAD & FADE IN ====================
window.addEventListener('load', () => {
  // Fade in entire body
  document.body.style.opacity = "1";

  // Fade in elements with .fade-in class sequentially
  const fadeElements = document.querySelectorAll('.fade-in');
  fadeElements.forEach((el, index) => {
    setTimeout(() => {
      el.classList.add('visible');
    }, 500 + index * 300); // staggered fade: 500ms delay + 300ms per element
  });
});

// ==================== HERO SLIDESHOW ====================
const heroMedia = document.querySelectorAll('.hero-media');
let index = 0;

function showNext() {
  heroMedia.forEach((el, i) => {
    el.style.opacity = i === index ? "1" : "0";
  });
  index = (index + 1) % heroMedia.length;
}

showNext(); // show first media
setInterval(showNext, 6000); // change every 6 seconds

// ==================== SERVICES SLIDER ====================
const services = [
  {
    title: "Residential Development",
    img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
    text1:
      "We specialize in high-quality residential developments designed for luxury living and long-term value.",
    text2:
      "From bespoke private residences to large-scale developments, we deliver exceptional quality and architectural excellence."
  },
  {
    title: "Commercial Properties",
    img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab",
    text1:
      "We develop and manage premium commercial properties in strategic business locations.",
    text2:
      "Our commercial developments are designed to maximize ROI and long-term sustainability."
  },
];

let serviceIndex = 0;

// ELEMENTS
const serviceImage = document.getElementById("serviceImage");
const serviceTitle = document.getElementById("serviceTitle");
const serviceText1 = document.getElementById("serviceText1");
const serviceText2 = document.getElementById("serviceText2");

// UPDATE FUNCTION
function updateService(index) {
  [serviceImage, serviceTitle, serviceText1, serviceText2].forEach(el =>
    el.classList.add("fade-out")
  );

  setTimeout(() => {
    serviceImage.src = services[index].img;
    serviceTitle.textContent = services[index].title;
    serviceText1.textContent = services[index].text1;
    serviceText2.textContent = services[index].text2;

    [serviceImage, serviceTitle, serviceText1, serviceText2].forEach(el =>
      el.classList.remove("fade-out")
    );
  }, 300);
}

// BUTTON EVENTS
document.getElementById("nextService").addEventListener("click", () => {
  serviceIndex = (serviceIndex + 1) % services.length;
  updateService(serviceIndex);
});

document.getElementById("prevService").addEventListener("click", () => {
  serviceIndex = (serviceIndex - 1 + services.length) % services.length;
  updateService(serviceIndex);
});

// ==================== MOBILE MENU TOGGLE ====================
const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');

if (menuToggle && mainNav) {
  menuToggle.addEventListener('click', () => {
    mainNav.classList.toggle('active');
    
    // Change hamburger to X when open
    const isOpen = mainNav.classList.contains('active');
    if (isOpen) {
      menuToggle.innerHTML = `
        <svg width="30" height="30" viewBox="0 0 30 30" fill="currentColor">
          <path d="M6 6L24 24M6 24L24 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      `;
    } else {
      menuToggle.innerHTML = `
        <svg width="30" height="30" viewBox="0 0 30 30" fill="currentColor">
          <path d="M4 7h22M4 15h22M4 23h22" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      `;
    }
  });

  // Close menu when clicking on a link
  const navLinks = mainNav.querySelectorAll('a');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('active');
      menuToggle.innerHTML = `
        <svg width="30" height="30" viewBox="0 0 30 30" fill="currentColor">
          <path d="M4 7h22M4 15h22M4 23h22" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      `;
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!mainNav.contains(e.target) && !menuToggle.contains(e.target)) {
      mainNav.classList.remove('active');
      menuToggle.innerHTML = `
        <svg width="30" height="30" viewBox="0 0 30 30" fill="currentColor">
          <path d="M4 7h22M4 15h22M4 23h22" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      `;
    }
  });
}

// ==================== SMOOTH SCROLLING ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const headerOffset = 80; // Height of fixed header
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// ==================== FEATURED PROPERTIES CAROUSEL ====================
const propertiesCarousel = document.querySelector('.properties-carousel');
const propertyCards = document.querySelectorAll('.property-card-featured');
const prevPropertyBtn = document.getElementById('prevProperty');
const nextPropertyBtn = document.getElementById('nextProperty');
const dotsContainer = document.getElementById('propertyDots');

let currentPropertyIndex = 0;

// Get number of visible cards based on screen size
function getVisibleCards() {
  const width = window.innerWidth;
  if (width < 768) return 1;
  if (width < 1200) return 2;
  return 3;
}

let cardsVisible = getVisibleCards();

// Create dots based on number of scrollable positions
if (propertyCards.length > 0 && dotsContainer) {
  const totalSlides = Math.max(1, propertyCards.length - cardsVisible + 1);
  
  for (let i = 0; i < totalSlides; i++) {
    const dot = document.createElement('div');
    dot.classList.add('dot');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
  }
}

// Update carousel position
function updateCarousel() {
  if (propertiesCarousel && propertyCards.length > 0) {
    const firstCard = propertyCards[0];
    const cardStyle = window.getComputedStyle(firstCard);
    const cardWidth = firstCard.offsetWidth;
    const gap = parseInt(cardStyle.marginRight) || 32;
    
    const scrollAmount = currentPropertyIndex * (cardWidth + gap);
    propertiesCarousel.style.transform = `translateX(-${scrollAmount}px)`;
    propertiesCarousel.style.transition = 'transform 0.4s ease';
    
    // Update dots
    const dots = document.querySelectorAll('.carousel-dots .dot');
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentPropertyIndex);
    });
  }
}

// Get max index (last scrollable position)
function getMaxIndex() {
  return Math.max(0, propertyCards.length - cardsVisible);
}

// Next property
if (nextPropertyBtn) {
  nextPropertyBtn.addEventListener('click', () => {
    const maxIndex = getMaxIndex();
    if (currentPropertyIndex < maxIndex) {
      currentPropertyIndex++;
      updateCarousel();
    }
  });
}

// Previous property
if (prevPropertyBtn) {
  prevPropertyBtn.addEventListener('click', () => {
    if (currentPropertyIndex > 0) {
      currentPropertyIndex--;
      updateCarousel();
    }
  });
}

// Go to specific slide
function goToSlide(slideIndex) {
  const maxIndex = getMaxIndex();
  currentPropertyIndex = Math.min(slideIndex, maxIndex);
  updateCarousel();
}

// Touch/swipe support for mobile
let touchStartX = 0;
let touchEndX = 0;

if (propertiesCarousel) {
  propertiesCarousel.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });

  propertiesCarousel.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  });
}

function handleSwipe() {
  const maxIndex = getMaxIndex();
  if (touchEndX < touchStartX - 50) {
    // Swipe left
    if (currentPropertyIndex < maxIndex) {
      currentPropertyIndex++;
      updateCarousel();
    }
  }
  if (touchEndX > touchStartX + 50) {
    // Swipe right
    if (currentPropertyIndex > 0) {
      currentPropertyIndex--;
      updateCarousel();
    }
  }
}

// Handle window resize
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    const newCardsVisible = getVisibleCards();
    if (newCardsVisible !== cardsVisible) {
      cardsVisible = newCardsVisible;
      
      // Recreate dots
      if (dotsContainer) {
        dotsContainer.innerHTML = '';
        const totalSlides = Math.max(1, propertyCards.length - cardsVisible + 1);
        
        for (let i = 0; i < totalSlides; i++) {
          const dot = document.createElement('div');
          dot.classList.add('dot');
          if (i === currentPropertyIndex) dot.classList.add('active');
          dot.addEventListener('click', () => goToSlide(i));
          dotsContainer.appendChild(dot);
        }
      }
      
      // Reset position if needed
      const maxIndex = getMaxIndex();
      if (currentPropertyIndex > maxIndex) {
        currentPropertyIndex = maxIndex;
      }
      updateCarousel();
    }
  }, 250);
});

// Initialize
updateCarousel();

const enquiryForm = document.getElementById('enquiryForm');

if (enquiryForm) {
  enquiryForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const submitBtn = this.querySelector('.submit-btn');
    const formData = new FormData(this);
    
    submitBtn.innerText = "Sending...";
    submitBtn.disabled = true;

    try {
      const response = await fetch(this.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        alert("✅ Thank you! Your enquiry has been sent to SterlingStone Realty.");
        enquiryForm.reset();
      } else {
        alert("❌ Oops! There was a problem. Please check all fields.");
      }
    } catch (error) {
      alert("❌ Network error. Please try again.");
    } finally {
      submitBtn.innerText = "Submit";
      submitBtn.disabled = false;
    }
  });
}