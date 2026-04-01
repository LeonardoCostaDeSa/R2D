(() => {
  'use strict';

  /* ============================================
     1. SCROLL ANIMATIONS (IntersectionObserver)
     ============================================ */
  const animatedEls = document.querySelectorAll('.animate-on-scroll');
  if (animatedEls.length) {
    // Mark HTML as JS-ready so CSS hides elements for animation
    document.documentElement.classList.add('js-ready');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: '0px 0px -30px 0px' }
    );

    animatedEls.forEach((el) => observer.observe(el));

    // Fallback: force-reveal elements already in viewport after a short delay
    setTimeout(() => {
      animatedEls.forEach((el) => {
        if (!el.classList.contains('visible')) {
          const rect = el.getBoundingClientRect();
          if (rect.top < window.innerHeight && rect.bottom > 0) {
            el.classList.add('visible');
          }
        }
      });
    }, 200);
  }

  /* ============================================
     2. NAV BACKGROUND TOGGLE
     ============================================ */
  const nav = document.getElementById('nav');
  const hero = document.getElementById('hero');

  if (nav && hero) {
    const navObserver = new IntersectionObserver(
      ([entry]) => {
        nav.classList.toggle('scrolled', !entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    navObserver.observe(hero);
  }

  /* ============================================
     3. MOBILE MENU
     ============================================ */
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  const overlay = document.getElementById('mobileOverlay');

  function closeMenu() {
    hamburger?.classList.remove('active');
    navLinks?.classList.remove('active');
    overlay?.classList.remove('active');
    document.body.classList.remove('menu-open');
  }

  function toggleMenu() {
    const isOpen = navLinks?.classList.contains('active');
    if (isOpen) {
      closeMenu();
    } else {
      hamburger?.classList.add('active');
      navLinks?.classList.add('active');
      overlay?.classList.add('active');
      document.body.classList.add('menu-open');
    }
  }

  hamburger?.addEventListener('click', toggleMenu);
  overlay?.addEventListener('click', closeMenu);

  // Close menu on nav link click
  navLinks?.querySelectorAll('.nav__link').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  /* ============================================
     4. COUNTER ANIMATION
     ============================================ */
  const statNumbers = document.querySelectorAll('.stat__number[data-count]');

  if (statNumbers.length) {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    statNumbers.forEach((el) => counterObserver.observe(el));
  }

  function animateCounter(el) {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix ?? '%';
    const prefix = el.dataset.prefix ?? '';
    const duration = 2000;
    const start = performance.now();

    function easeOutCubic(t) {
      return 1 - Math.pow(1 - t, 3);
    }

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(progress);
      const current = Math.round(eased * target);

      el.textContent = prefix + current + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  /* ============================================
     5. SMOOTH SCROLL (fallback for older browsers)
     ============================================ */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const navHeight = nav?.offsetHeight || 80;
        const targetPos = targetEl.getBoundingClientRect().top + window.scrollY - navHeight;
        window.scrollTo({ top: targetPos, behavior: 'smooth' });
      }
    });
  });
})();
