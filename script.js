'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const nav = document.querySelector('.nav');

//------------------Open Modal------------------
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

// for (let i = 0; i < btnsOpenModal.length; i++)
//   btnsOpenModal[i].addEventListener('click', openModal);

// instead of for we write forEach
btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

//------------------Smooth Scrolling------------------
btnScrollTo.addEventListener('click', function (e) {
  // const s1Coordinate = section1.getBoundingClientRect();

  // window.scrollTo({
  //   left: s1Coordinate.left + window.pageXOffset,
  //   top: s1Coordinate.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });

  // this is the modern way and the last one is the old way
  section1.scrollIntoView({ behavior: 'smooth' });
});

//------------------Sticky Navigation------------------
//----------This way doesnt have a good performance
// const initialCoordinate = section1.getBoundingClientRect();
// window.addEventListener('scroll', function () {
//   if (window.scrollY > initialCoordinate.top) nav.classList.add('sticky');
//   else nav.classList.remove('sticky');
// });

// Intersection Observer API
const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;
// پس هر زمان سکشن یک ما با روت که ویوپورتمون هست اندازه ده درصد همپوشانی کردن فانگشن اجرا میشه
const stickyNav = function (entries) {
  const [entry] = entries;

  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const obsOption = {
  // روت پراپرتی ای هست که ببینم سکشن من باهاش همپوشانی داره یا نه
  root: null,
  // یک دهم میشه ده درصد که اگر با این مقدار همپوشانی کردن کال بک اجرا شه
  threshold: 0,
  rootMargin: `-${navHeight}px`,
};

// وضعیت نمایش یک عنصر را در صفحه وب دنبال کنید. این ابزار می‌تواند بگوید که آیا یک عنصر (مثل یک تصویر یا بلوک متنی) در ناحیه قابل مشاهده صفحه (viewport) قرار دارد یا خیر.
const headerObserver = new IntersectionObserver(stickyNav, obsOption);
headerObserver.observe(header);

//------------------Page Navigation------------------
//----------This way doesnt have a good performance
// document.querySelectorAll('.nav__link').forEach(function (element) {
//   element.addEventListener('click', function (e) {
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });

//----------This way have a good performance with bubbling...
// 1. Add event listener to common parent element
// 2. Determine what element orginated the event

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  // Matching strategy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

//------------------Menu Fade Animation------------------
// write this function for not to write the code again
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    // const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el != link) el.style.opacity = this;
    });
  }
};
// mouse enter dont have bubbling so we use mouse over
nav.addEventListener('mouseover', handleHover.bind(0.5));

nav.addEventListener('mouseout', handleHover.bind(1));

//------------------Tab Component------------------
const tabsContainer = document.querySelector('.operations__tab-container');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContent = document.querySelectorAll('.operations__content');
// این روش بهینه ای نیست چون با هر بار کلیک میاد یک ایونت لیسنر میسازه
// tabs.forEach(tab => tab.addEventListener('click', () => console.log('tab')));

// use event delegation
tabsContainer.addEventListener('click', function (tab) {
  // به دلیل اینکه وقتی روی دکمه درواقع روش نوشتش کلیک میکنیم اسپن رو بهمون برمیگردونه پس ما اینجا از متود زیر استفاده میکنیم تا پرنتش که خود دکمه هست رو برگردونه و از خطاهای احتمالی تا حدودی جلوگیری کنه
  const clicked = tab.target.closest('.operations__tab');

  // Guard class
  if (!clicked) return;

  // active tab
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  // activate tab
  clicked.classList.add('operations__tab--active');

  // activate content area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

//------------------Appear Sections------------------
const allSections = document.querySelectorAll('.section');

const appearSection = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};
const sectionObserver = new IntersectionObserver(appearSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

//------------------Lazy Loading Images------------------
const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  // Replace src with data-src
  entry.target.src = entry.target.dataset.src;

  // Remove poor quality photos
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
});

imgTargets.forEach(img => imgObserver.observe(img));

//------------------Sliders------------------
const slides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
const dotContainer = document.querySelector('.dots');

let currentSlide = 0;
const maxSlide = slides.length;

// Create dots
const createDots = function () {
  slides.forEach(function (_, i) {
    dotContainer.insertAdjacentHTML(
      'beforeend',
      `<button class="dots__dot" data-slide="${i}"></button>`
    );
  });
};
createDots();

// Activate dots
const activateDot = function (slide) {
  document
    .querySelectorAll('.dots__dot')
    .forEach(dot => dot.classList.remove('dots__dot--active'));

  document
    .querySelector(`.dots__dot[data-slide="${slide}"]`)
    .classList.add('dots__dot--active');
};
activateDot(0);

// 0%, 100%, 200%, 300% => 100*1, 100*2, ...
const goToSlide = function (s) {
  slides.forEach(
    (slide, index) =>
      (slide.style.transform = `translateX(${100 * (index - s)}%)`)
    // currentSlide = 1: -100%, ...
  );
};
goToSlide(0);

// Next slide
const nextSlide = function () {
  if (currentSlide === maxSlide - 1) {
    currentSlide = 0;
  } else {
    currentSlide++;
  }

  goToSlide(currentSlide);
  activateDot(currentSlide);
};

// previous slide
const prevSlide = function () {
  if (currentSlide === 0) {
    currentSlide = maxSlide - 1;
  } else {
    currentSlide--;
  }

  goToSlide(currentSlide);
  activateDot(currentSlide);
};

// go to next slide
btnRight.addEventListener('click', nextSlide);
btnLeft.addEventListener('click', prevSlide);

// work with next and previous button
document.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowLeft') prevSlide();
  if (e.key === 'ArrowRight') nextSlide();
});

dotContainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('dots__dot')) {
    const dot = e.target.dataset.slide;
    goToSlide(dot);
    activateDot(dot);
  }
});