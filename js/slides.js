(function () {
  'use strict';

  var slides = document.querySelectorAll('.presentation .slide');
  var dotsContainer = document.querySelector('.slide-dots');
  var prevBtn = document.querySelector('.slide-nav__prev');
  var nextBtn = document.querySelector('.slide-nav__next');
  var current = 0;

  function goTo(index) {
    if (index < 0) index = 0;
    if (index >= slides.length) index = slides.length - 1;
    current = index;
    var el = slides[current];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    updateDots();
  }

  function updateDots() {
    if (!dotsContainer) return;
    var tabs = dotsContainer.querySelectorAll('[role="tab"]');
    tabs.forEach(function (tab, i) {
      tab.setAttribute('aria-selected', i === current ? 'true' : 'false');
    });
  }

  function buildDots() {
    if (!dotsContainer || !slides.length) return;
    dotsContainer.innerHTML = '';
    for (var i = 0; i < slides.length; i++) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-label', 'Folie ' + (i + 1));
      btn.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
      btn.addEventListener('click', function () { goTo(parseInt(this.getAttribute('data-index'), 10)); });
      btn.setAttribute('data-index', String(i));
      dotsContainer.appendChild(btn);
    }
  }

  function onHashChange() {
    var hash = window.location.hash.slice(1);
    for (var i = 0; i < slides.length; i++) {
      if (slides[i].id === hash) {
        current = i;
        updateDots();
        return;
      }
    }
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      goTo(current - 1);
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
      e.preventDefault();
      goTo(current + 1);
    }
  });

  if (prevBtn) prevBtn.addEventListener('click', function () { goTo(current - 1); });
  if (nextBtn) nextBtn.addEventListener('click', function () { goTo(current + 1); });

  window.addEventListener('hashchange', onHashChange);

  buildDots();
  onHashChange();
})();
