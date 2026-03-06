(function () {
  'use strict';

  function init() {
    initHeroCarousel();
    initFaqAccordion();
    initCatalogueModal();
    initCallbackModal();
    initPriceStickyHeader();
  }

  // ----- Hero carousel (product images) -----
  function initHeroCarousel() {
  var heroTrack = document.getElementById('hero-carousel');
  var heroThumbs = document.getElementById('hero-thumbnails');
  var heroWrap = document.getElementById('hero-zoom-wrap');
  var zoomLens = document.getElementById('hero-zoom-lens');
  var zoomPreview = document.getElementById('hero-zoom-preview');
  if (heroTrack && heroThumbs) {
    var slides = heroTrack.querySelectorAll('.hero-slide');
    var total = slides.length;
    var slideWidth = 570; // match .hero-slide width in CSS
    var currentIndex = 0;
    var zoomFactor = 2.5;
    var lensSize = 80;
    var previewSize = 240;

    function setHeroSlide(index) {
      currentIndex = (index + total) % total;
      heroTrack.style.transform = 'translateX(-' + currentIndex * slideWidth + 'px)';
      var thumbs = heroThumbs.querySelectorAll('.hero-thumb');
      thumbs.forEach(function (thumb, i) {
        thumb.classList.toggle('active', i === currentIndex);
        thumb.setAttribute('aria-label', 'View slide ' + (i + 1));
      });
    }

    heroThumbs.querySelectorAll('.hero-thumb').forEach(function (thumb, i) {
      thumb.addEventListener('click', function () {
        setHeroSlide(i);
      });
    });

    var prevBtn = document.querySelector('.hero-prev');
    var nextBtn = document.querySelector('.hero-next');
    if (prevBtn) prevBtn.addEventListener('click', function () { setHeroSlide(currentIndex - 1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { setHeroSlide(currentIndex + 1); });

    /* Hover zoom: lens + magnified preview */
    if (heroWrap && zoomLens && zoomPreview) {
      function getCurrentImg() {
        var slide = slides[currentIndex];
        return slide ? slide.querySelector('img') : null;
      }
      function clamp(val, min, max) {
        return Math.max(min, Math.min(max, val));
      }
      function updateZoomPosition(clientX, clientY) {
        var rect = heroWrap.getBoundingClientRect();
        var x = clientX - rect.left;
        var y = clientY - rect.top;
        var half = lensSize / 2;
        x = clamp(x, half, rect.width - half);
        y = clamp(y, half, rect.height - half);
        zoomLens.style.left = (x - half) + 'px';
        zoomLens.style.top = (y - half) + 'px';
        var bgX = previewSize / 2 - x * zoomFactor;
        var bgY = previewSize / 2 - y * zoomFactor;
        zoomPreview.style.backgroundPosition = bgX + 'px ' + bgY + 'px';
      }
      heroWrap.addEventListener('mouseenter', function (e) {
        var img = getCurrentImg();
        if (img && img.src) {
          zoomPreview.style.backgroundImage = 'url(' + img.src + ')';
          zoomPreview.style.backgroundSize = (slideWidth * zoomFactor) + 'px ' + (slideWidth * zoomFactor) + 'px';
          zoomLens.classList.add('is-active');
          zoomPreview.classList.add('is-active');
          zoomLens.setAttribute('aria-hidden', 'false');
          zoomPreview.setAttribute('aria-hidden', 'false');
          updateZoomPosition(e.clientX, e.clientY);
        }
      });
      heroWrap.addEventListener('mousemove', function (e) {
        if (!zoomLens.classList.contains('is-active')) return;
        updateZoomPosition(e.clientX, e.clientY);
      });
      heroWrap.addEventListener('mouseleave', function () {
        zoomLens.classList.remove('is-active');
        zoomPreview.classList.remove('is-active');
        zoomLens.setAttribute('aria-hidden', 'true');
        zoomPreview.setAttribute('aria-hidden', 'true');
      });
    }
  }
  }

  // ----- FAQ accordion -----
  function initFaqAccordion() {
  var faqItems = document.querySelectorAll('.faq-item[data-faq]');
  faqItems.forEach(function (item) {
    var btn = item.querySelector('.faq-question');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var isOpen = item.getAttribute('data-open') === 'true';
      faqItems.forEach(function (other) {
        other.removeAttribute('data-open');
        var otherBtn = other.querySelector('.faq-question');
        if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.setAttribute('data-open', 'true');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
  }

  // ----- Catalogue modal -----
  function initCatalogueModal() {
  var catalogueModal = document.getElementById('catalogue-modal');
  var catalogueForm = document.getElementById('catalogue-modal-form');
  var catalogueNameInput = document.getElementById('catalogue-modal-name');

  function openCatalogueModal() {
    if (!catalogueModal) return;
    catalogueModal.setAttribute('aria-hidden', 'false');
    if (catalogueForm) catalogueForm.reset();
    if (catalogueNameInput) catalogueNameInput.focus();
  }

  function closeCatalogueModal() {
    if (!catalogueModal) return;
    catalogueModal.setAttribute('aria-hidden', 'true');
  }

  if (catalogueModal) {
    document.addEventListener('click', function (e) {
      var trigger = e.target && e.target.closest && e.target.closest('.js-open-catalogue-modal');
      if (trigger) {
        e.preventDefault();
        e.stopPropagation();
        openCatalogueModal();
      }
    });

    catalogueModal.querySelector('.catalogue-modal-close').addEventListener('click', closeCatalogueModal);
    catalogueModal.querySelector('.catalogue-modal-backdrop').addEventListener('click', closeCatalogueModal);

    if (catalogueForm) {
      catalogueForm.addEventListener('submit', function (e) {
        e.preventDefault();
        closeCatalogueModal();
      });
    }

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && catalogueModal.getAttribute('aria-hidden') === 'false') {
        closeCatalogueModal();
      }
    });
  }
  }

  // ----- Request a call back modal -----
  function initCallbackModal() {
  var callbackModal = document.getElementById('callback-modal');
  var callbackForm = document.getElementById('callback-modal-form');

  function openCallbackModal() {
    if (!callbackModal) return;
    callbackModal.setAttribute('aria-hidden', 'false');
    var firstInput = callbackModal.querySelector('input, select');
    if (firstInput) firstInput.focus();
  }

  function closeCallbackModal() {
    if (!callbackModal) return;
    callbackModal.setAttribute('aria-hidden', 'true');
  }

  if (callbackModal) {
    document.querySelectorAll('.js-open-callback-modal').forEach(function (trigger) {
      trigger.addEventListener('click', function (e) {
        e.preventDefault();
        openCallbackModal();
      });
    });

    callbackModal.querySelector('.callback-modal-close').addEventListener('click', closeCallbackModal);
    callbackModal.querySelector('.callback-modal-backdrop').addEventListener('click', closeCallbackModal);

    if (callbackForm) {
      callbackForm.addEventListener('submit', function (e) {
        e.preventDefault();
        closeCallbackModal();
      });
    }

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && callbackModal.getAttribute('aria-hidden') === 'false') {
        closeCallbackModal();
      }
    });
  }
  }

  // ----- Sticky price header: show when scrolled past first fold (scroll down), hide when scroll up -----
  function initPriceStickyHeader() {
    var priceHeader = document.getElementById('price-sticky-header');
    if (!priceHeader) return;
    var lastScrollY = 0;
    var ticking = false;

    function updatePriceHeader() {
      var scrollY = window.scrollY || window.pageYOffset;
      var threshold = window.innerHeight;
      var isPastFold = scrollY > threshold;
      var scrollingDown = scrollY > lastScrollY;
      lastScrollY = scrollY;

      if (isPastFold && scrollingDown) {
        priceHeader.classList.add('is-visible');
        priceHeader.setAttribute('aria-hidden', 'false');
      } else {
        priceHeader.classList.remove('is-visible');
        priceHeader.setAttribute('aria-hidden', 'true');
      }
      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updatePriceHeader);
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    updatePriceHeader();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
