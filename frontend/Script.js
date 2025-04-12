document.addEventListener('DOMContentLoaded', function() {
  // API URL
  const API_URL = 'https://aimenuplanner.onrender.com/api/recommend';
  
  // Elements
  const getStartedBtn = document.getElementById('get-started-btn');
  const mealPlannerSection = document.getElementById('meal-planner');
  const cuisineSelect = document.getElementById('cuisine');
  const mealTimeSelect = document.getElementById('meal-time');
  const recommendBtn = document.getElementById('recommend-btn');
  const loadingDiv = document.getElementById('loading');
  const recommendationDiv = document.getElementById('recommendation');
  const mealNameEl = document.getElementById('meal-name');
  const mealTagsEl = document.getElementById('meal-tags');
  const mealImageEl = document.getElementById('meal-image');
  const mealInstructionsEl = document.getElementById('meal-instructions');
  const newRecommendationBtn = document.getElementById('new-recommendation');
  const shareRecommendationBtn = document.getElementById('share-recommendation');
  const cuisineSelectBtns = document.querySelectorAll('.cuisine-select-btn');
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');
  
  // Mock meal images mapping
  const mealImages = {
    // Ghanaian meals
    'Hausa koko with koose': 'ghanaian-breakfast-1.jpg',
    'Waakye': 'ghanaian-breakfast-2.jpg',
    'Tom Brown porridge': 'ghanaian-breakfast-3.jpg',
    'Fufu with light soup': 'ghanaian-lunch-1.jpg',
    'Banku with tilapia': 'ghanaian-lunch-2.jpg',
    'Jollof rice': 'ghanaian-lunch-3.jpg',
    'Tuo zaafi with soup': 'ghanaian-dinner-1.jpg',
    'Kenkey with fried fish': 'ghanaian-dinner-2.jpg',
    'Omo tuo': 'ghanaian-dinner-3.jpg',
    
    // Nigerian meals
    'Akara with pap': 'nigerian-breakfast-1.jpg',
    'Moi moi with bread': 'nigerian-breakfast-2.jpg',
    'Yam and egg': 'nigerian-breakfast-3.jpg',
    'Pounded yam with egusi': 'nigerian-lunch-1.jpg',
    'Amala with ewedu': 'nigerian-lunch-2.jpg',
    'Ofada rice': 'nigerian-lunch-3.jpg',
    'Eba with okro soup': 'nigerian-dinner-1.jpg',
    'Pepper soup': 'nigerian-dinner-2.jpg'
  };
  
  // Default image if meal is not found in mapping
  const defaultMealImage = 'placeholder-meal.jpg';
  
  // Mobile menu toggle
  mobileMenuBtn.addEventListener('click', function() {
    navLinks.classList.toggle('active');
  });
  
  // Smooth scroll for navigation links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: 'smooth'
        });
        
        // Hide mobile menu if it's open
        navLinks.classList.remove('active');
      }
    });
  });
  
  // Scroll to meal planner section when "Get Started" is clicked
  getStartedBtn.addEventListener('click', function() {
    mealPlannerSection.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
    setTimeout(() => {
      recommendBtn.focus();
    }, 1000);
  });
  
  // Handle cuisine selection from the cuisine cards
  cuisineSelectBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const selectedCuisine = this.dataset.cuisine;
      cuisineSelect.value = selectedCuisine;
      
      mealPlannerSection.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
      setTimeout(() => {
        recommendBtn.focus();
      }, 1000);
    });
  });
  
  // Get recommendation
  recommendBtn.addEventListener('click', getMealRecommendation);
  newRecommendationBtn.addEventListener('click', getMealRecommendation);
  
  // Share functionality
  shareRecommendationBtn.addEventListener('click', function() {
    if (navigator.share) {
      const mealName = mealNameEl.textContent;
      const instructions = mealInstructionsEl.textContent;
      
      navigator.share({
        title: `AI Menu Planner: ${mealName}`,
        text: `Check out this ${cuisineSelect.value} ${mealTimeSelect.value} meal: ${mealName}. ${instructions}`,
        url: window.location.href
      })
      .catch(console.error);
    } else {
      // Fallback for browsers that don't support Web Share API
      alert('Recipe copied to clipboard! Share it with your friends.');
      
      const textToCopy = `${mealNameEl.textContent}\n\n${mealInstructionsEl.textContent}\n\nGet more recipes at: ${window.location.href}`;
      
      navigator.clipboard.writeText(textToCopy)
        .catch(err => console.error('Could not copy text: ', err));
    }
  });
  
  // Form submission handlers
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const nameInput = document.getElementById('name');
      const emailInput = document.getElementById('email');
      const messageInput = document.getElementById('message');
      
      // Basic validation
      if (nameInput.value && emailInput.value && messageInput.value) {
        // Simulate form submission
        alert('Thank you for your message! We will get back to you soon.');
        contactForm.reset();
      }
    });
  }
  
  const newsletterForm = document.getElementById('newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const emailInput = newsletterForm.querySelector('input[type="email"]');
      
      if (emailInput.value) {
        // Simulate subscription
        alert('Thank you for subscribing to our newsletter!');
        newsletterForm.reset();
      }
    });
  }
  
  // Testimonial slider
  const dots = document.querySelectorAll('.slider-dots .dot');
  const testimonials = document.querySelectorAll('.testimonial');
  let currentSlide = 0;
  
  function showSlide(index) {
    // Hide all testimonials
    testimonials.forEach(testimonial => {
      testimonial.style.display = 'none';
    });
    
    // Remove active class from all dots
    dots.forEach(dot => {
      dot.classList.remove('active');
    });
    
    // Show current testimonial and activate current dot
    testimonials[index].style.display = 'block';
    dots[index].classList.add('active');
  }
  
  // Initialize slider
  showSlide(currentSlide);
  
  // Add click event to dots
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      showSlide(index);
      currentSlide = index;
    });
  });
  
  // Auto-rotate testimonials
  setInterval(() => {
    currentSlide = (currentSlide + 1) % testimonials.length;
    showSlide(currentSlide);
  }, 5000);
  
  // Function to get meal recommendation from API
  function getMealRecommendation() {
    const cuisine = cuisineSelect.value;
    const mealTime = mealTimeSelect.value;
    
    // Validate inputs
    if (!cuisine || !mealTime) {
      alert('Please select both cuisine and meal time.');
      return;
    }
    
    // Show loading state
    loadingDiv.classList.remove('hidden');
    recommendationDiv.classList.add('hidden');
    
    // Make API request
    fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        cuisine: cuisine,
        meal_time: mealTime
      })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      // Update UI with the recommendation
      mealNameEl.textContent = data.meal;
      
      // Update tags
      const cuisineTag = mealTagsEl.querySelector('.cuisine-tag');
      const mealTimeTag = mealTagsEl.querySelector('.meal-time-tag');
      
      cuisineTag.textContent = cuisine.charAt(0).toUpperCase() + cuisine.slice(1);
      mealTimeTag.textContent = mealTime.charAt(0).toUpperCase() + mealTime.slice(1);
      
      // Update image
      const imagePath = mealImages[data.meal] || defaultMealImage;
      mealImageEl.src = imagePath;
      mealImageEl.alt = data.meal;
      
      // Update instructions
      mealInstructionsEl.textContent = data.instructions;
      
      // Hide loading, show recommendation
      loadingDiv.classList.add('hidden');
      recommendationDiv.classList.remove('hidden');
      
      // Scroll to recommendation
      recommendationDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
    })
    .catch(error => {
      console.error('Error fetching recommendation:', error);
      alert('Failed to get meal recommendation. Please try again later.');
      loadingDiv.classList.add('hidden');
    });
  }
  
  // Lazy load images for better performance
  const lazyImages = document.querySelectorAll('img[data-src]');
  
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      });
    });
    
    lazyImages.forEach(img => {
      imageObserver.observe(img);
    });
  } else {
    // Fallback for browsers without IntersectionObserver
    lazyImages.forEach(img => {
      img.src = img.dataset.src;
    });
  }
});