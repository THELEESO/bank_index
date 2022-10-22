'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');
const section1 = document.querySelector('#section--1');
const header = document.querySelector('.header');
const sections = document.querySelectorAll('.section');
const imgTargets = document.querySelectorAll('img[data-src]');

const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

for (let i = 0; i < btnsOpenModal.length; i++)
  btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// -----Nav----- Hover
const navhandler = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(ele => {
      if (ele !== link) ele.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};
// use bind to connect this
nav.addEventListener('mouseover', navhandler.bind(0.5));
nav.addEventListener('mouseout', navhandler.bind(1));

// -----Nav----- Move to the sections
document.querySelector('.nav__links').addEventListener('click', e => {
  e.preventDefault();
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

// -----Nav----- Sticky Nav
const navSize = nav.getBoundingClientRect().height;

const navStick = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};
// root: null => viewpoint, threshold: [0, 0.2] => while the target show in viewpoint about to 0% 20%
const stickyOps = { root: null, threshold: 0, rootMargin: `${-navSize}px` };
// use API
const headerObs = new IntersectionObserver(navStick, stickyOps);
// binding header
headerObs.observe(header);

// -----SECTIONs Reveal-----

const secReveal = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};
const secOps = { root: null, threshold: 0.15 };
const sectionObs = new IntersectionObserver(secReveal, secOps);

sections.forEach(s => {
  // s.classList.add('section--hidden');
  sectionObs.observe(s);
});

// -----SECTION 1 lazyImg-----

const imgReveal = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', () =>
    entry.target.classList.remove('lazy-img')
  );
  observer.unobserve(entry.target);
};

const imgObs = new IntersectionObserver(imgReveal, {
  root: null,
  threshold: 1,
  rootMargin: '200px',
});
imgTargets.forEach(i => {
  imgObs.observe(i);
});

// -----SECTION 2 Tabs-----
tabsContainer.addEventListener('click', e => {
  e.preventDefault();
  const clicked = e.target.closest('.operations__tab');
  console.log(clicked);

  if (!clicked) return;

  // remove all active
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  // active tab + content
  clicked.classList.add('operations__tab--active');
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

// -----SECTION 3 slide-----
(function sect3_Slide() {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotsContainer = document.querySelector('.dots');
  let curSlide = 0;
  const maxSlide = slides.length - 1;

  const dotBelow = function () {
    slides.forEach((_, i) => {
      dotsContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };
  dotBelow();

  const activeDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(d => d.classList.remove('dots__dot--active'));
    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const sliding = function (slide = 0) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${(i - slide) * 100}%)`)
    );
    activeDot(slide);
  };
  sliding();

  const leftSliding = function () {
    if (curSlide !== 0) curSlide--;
    else curSlide = maxSlide;
    sliding(curSlide);
  };
  const rightSliding = function () {
    if (curSlide !== maxSlide) curSlide++;
    else curSlide = 0;
    sliding(curSlide);
  };

  btnRight.addEventListener('click', rightSliding);
  btnLeft.addEventListener('click', leftSliding);
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') leftSliding();
    if (e.key === 'ArrowRight') rightSliding();
  });

  dotsContainer.addEventListener('click', e => {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      sliding(slide);
    }
  });
})();
