/**
 * KMB Metro Altyapı - Main JavaScript
 * Modern Interactive Website
 */

document.addEventListener('DOMContentLoaded', function() {
  
  // ========================================
  // NAVBAR SCROLL EFFECT
  // ========================================
  const navbar = document.querySelector('.navbar-custom');
  
  function handleNavbarScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
  
  window.addEventListener('scroll', handleNavbarScroll);
  handleNavbarScroll(); // Run on load
  
  // ========================================
  // SMOOTH SCROLL FOR ANCHOR LINKS
  // ========================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const target = document.querySelector(targetId);
      if (target) {
        const navHeight = navbar.offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
        
        // Close mobile menu if open
        const navbarCollapse = document.querySelector('.navbar-collapse');
        if (navbarCollapse.classList.contains('show')) {
          const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
          if (bsCollapse) bsCollapse.hide();
        }
      }
    });
  });
  
  // ========================================
  // SCROLL REVEAL ANIMATION
  // ========================================
  const revealElements = document.querySelectorAll('.reveal');
  
  function revealOnScroll() {
    const windowHeight = window.innerHeight;
    const revealPoint = 150;
    
    revealElements.forEach(element => {
      const elementTop = element.getBoundingClientRect().top;
      
      if (elementTop < windowHeight - revealPoint) {
        element.classList.add('active');
      }
    });
  }
  
  window.addEventListener('scroll', revealOnScroll);
  revealOnScroll(); // Run on load
  
  // ========================================
  // COUNTER ANIMATION
  // ========================================
  function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-count')) || 0;
    const suffix = element.getAttribute('data-suffix') || '';
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    
    const counter = setInterval(() => {
      current += step;
      if (current >= target) {
        element.textContent = target + suffix;
        clearInterval(counter);
      } else {
        element.textContent = Math.floor(current) + suffix;
      }
    }, 16);
  }
  
  // Intersection Observer for counters
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counters = entry.target.querySelectorAll('.stat-value[data-count], .hero-stat-value[data-count]');
        counters.forEach(counter => {
          if (!counter.classList.contains('counted')) {
            counter.classList.add('counted');
            animateCounter(counter);
          }
        });
      }
    });
  }, { threshold: 0.5 });
  
  document.querySelectorAll('.stats-section, .hero-stats').forEach(section => {
    statObserver.observe(section);
  });
  
  // ========================================
  // PROJECT FILTER
  // ========================================
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectItems = document.querySelectorAll('.project-item');
  
  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Update active button
      filterButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
      
      const filter = this.getAttribute('data-filter');
      
      projectItems.forEach(item => {
        const categories = item.getAttribute('data-category') || '';
        
        if (filter === 'all' || categories.includes(filter)) {
          item.style.display = '';
          item.style.opacity = '0';
          item.style.transform = 'translateY(20px)';
          
          setTimeout(() => {
            item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
          }, 50);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'translateY(20px)';
          
          setTimeout(() => {
            item.style.display = 'none';
          }, 400);
        }
      });
    });
  });
  
  // ========================================
  // LANGUAGE SWITCHER
  // ========================================
  const langButtons = document.querySelectorAll('.lang-btn[data-lang]');
  
  function switchLanguage(lang, animate = true) {
    // Update active button
    langButtons.forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.querySelector(`.lang-btn[data-lang="${lang}"]`);
    if (activeBtn) activeBtn.classList.add('active');
    
    // Get all translatable elements
    const translatableElements = document.querySelectorAll('[data-tr][data-en]');
    
    if (animate && translatableElements.length > 0) {
      // Add fade out effect
      translatableElements.forEach(element => {
        element.style.transition = 'opacity 0.2s ease';
        element.style.opacity = '0';
      });
      
      // After fade out, change text and fade in
      setTimeout(() => {
        translatableElements.forEach(element => {
          const text = element.getAttribute(`data-${lang}`);
          if (text) {
            element.textContent = text;
          }
          element.style.opacity = '1';
        });
      }, 200);
    } else {
      // No animation, just change text
      translatableElements.forEach(element => {
        const text = element.getAttribute(`data-${lang}`);
        if (text) {
          element.textContent = text;
        }
      });
    }
    
    // Update html lang attribute
    document.documentElement.lang = lang === 'tr' ? 'tr' : 'en';
    
    // Save preference
    localStorage.setItem('kmbLang', lang);
  }
  
  langButtons.forEach(button => {
    button.addEventListener('click', function() {
      const lang = this.getAttribute('data-lang');
      switchLanguage(lang, true);
    });
  });
  
  // Load saved language preference on page load (without animation)
  const savedLang = localStorage.getItem('kmbLang');
  if (savedLang) {
    switchLanguage(savedLang, false);
  }
  
  // ========================================
  // ACTIVE NAV LINK ON SCROLL
  // ========================================
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
  
  function updateActiveNav() {
    const scrollPosition = window.scrollY + navbar.offsetHeight + 100;
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }
  
  window.addEventListener('scroll', updateActiveNav);
  
  // ========================================
  // IMAGE GALLERY HOVER EFFECT
  // ========================================
  document.querySelectorAll('.card-custom').forEach(card => {
    const mainImage = card.querySelector('.card-image img');
    const thumbs = card.querySelectorAll('.card-body-custom img');
    
    if (mainImage && thumbs.length > 0) {
      const originalSrc = mainImage.src;
      
      thumbs.forEach(thumb => {
        thumb.addEventListener('mouseenter', function() {
          mainImage.style.opacity = '0.5';
          setTimeout(() => {
            mainImage.src = this.src;
            mainImage.style.opacity = '1';
          }, 150);
        });
        
        thumb.addEventListener('mouseleave', function() {
          mainImage.style.opacity = '0.5';
          setTimeout(() => {
            mainImage.src = originalSrc;
            mainImage.style.opacity = '1';
          }, 150);
        });
      });
    }
  });
  
  // ========================================
  // PARALLAX EFFECT FOR HERO
  // ========================================
  const heroVisual = document.querySelector('.hero-visual');
  
  if (heroVisual) {
    window.addEventListener('scroll', function() {
      const scrolled = window.pageYOffset;
      if (scrolled < window.innerHeight) {
        heroVisual.style.transform = `translateY(${scrolled * 0.1}px)`;
      }
    });
  }
  
  // ========================================
  // CERTIFICATE CARD CLICK TO EXPAND
  // ========================================
  document.querySelectorAll('.certificate-card').forEach(card => {
    card.addEventListener('click', function() {
      const img = this.querySelector('.certificate-image img');
      if (img) {
        // Create lightbox
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox active';
        lightbox.innerHTML = `
          <div class="lightbox-content">
            <button class="lightbox-close">&times;</button>
            <img src="${img.src}" alt="${img.alt}">
          </div>
        `;
        document.body.appendChild(lightbox);
        document.body.style.overflow = 'hidden';
        
        // Close on click
        lightbox.addEventListener('click', function(e) {
          if (e.target === lightbox || e.target.classList.contains('lightbox-close')) {
            lightbox.remove();
            document.body.style.overflow = '';
          }
        });
        
        // Close on escape
        document.addEventListener('keydown', function(e) {
          if (e.key === 'Escape') {
            lightbox.remove();
            document.body.style.overflow = '';
          }
        });
      }
    });
  });
  
  // ========================================
  // FORM VALIDATION
  // ========================================
  const contactForm = document.querySelector('form');
  
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Simple validation
      const inputs = this.querySelectorAll('input, textarea');
      let isValid = true;
      
      inputs.forEach(input => {
        if (input.hasAttribute('required') && !input.value.trim()) {
          isValid = false;
          input.classList.add('is-invalid');
        } else {
          input.classList.remove('is-invalid');
        }
      });
      
      if (isValid) {
        // Show success message
        const btn = this.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="bi bi-check-circle"></i> Gönderildi!';
        btn.disabled = true;
        
        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.disabled = false;
          this.reset();
        }, 3000);
      }
    });
  }
  
  // ========================================
  // PRELOADER (Optional)
  // ========================================
  window.addEventListener('load', function() {
    document.body.classList.add('loaded');
    
    // Trigger reveal animations after load
    setTimeout(revealOnScroll, 100);
  });
  
  // ========================================
  // CONSOLE BRANDING
  // ========================================
  console.log('%c KMB Metro Altyapı ', 'background: #00d4aa; color: #0a0a0f; font-size: 20px; font-weight: bold; padding: 10px;');
  console.log('%c 1949\'dan bu yana altyapı ve metro inşaatında lider firma.', 'color: #8b949e; font-size: 12px;');
  
});
