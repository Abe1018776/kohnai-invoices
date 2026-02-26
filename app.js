/* ============================================
   Pinta AI — Invoice Overview
   Interactions & Animations
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // --- Scroll Progress Bar ---
  const progressBar = document.getElementById('scrollProgress');
  
  function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = progress + '%';
  }
  
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  // --- Animate urgency bars on scroll into view ---
  const urgencyBars = document.querySelectorAll('.urgency-bar-fill');
  
  const barObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const width = bar.getAttribute('data-width');
        bar.style.width = width + '%';
        barObserver.unobserve(bar);
      }
    });
  }, { threshold: 0.3 });
  
  urgencyBars.forEach(bar => {
    bar.style.width = '0%';
    barObserver.observe(bar);
  });

  // --- Staggered card entrance ---
  const cards = document.querySelectorAll('.invoice-card');
  
  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        cardObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  
  cards.forEach((card, i) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(12px)';
    card.style.transition = `opacity 0.4s ease ${i * 0.06}s, transform 0.4s ease ${i * 0.06}s`;
    cardObserver.observe(card);
  });

  // --- Section reveal on scroll ---
  const sections = document.querySelectorAll('.section');
  
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        sectionObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05 });
  
  sections.forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(16px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    sectionObserver.observe(section);
  });

  // --- Summary number count-up animation ---
  const totalAmountEl = document.querySelector('.summary-total-amount');
  
  if (totalAmountEl) {
    const targetValue = 44201.68;
    let animated = false;
    
    const totalObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !animated) {
          animated = true;
          animateValue(totalAmountEl, 0, targetValue, 800);
          totalObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    
    totalObserver.observe(totalAmountEl);
  }
  
  function animateValue(el, start, end, duration) {
    const startTime = performance.now();
    
    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = start + (end - start) * ease;
      
      el.textContent = '$' + current.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
      
      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }
    
    requestAnimationFrame(update);
  }

});
