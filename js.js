// Плавный слайдер для баннера + каскадная анимация появления содержимого
(function () {
  const banner = document.querySelector(".banner");
  if (!banner) return;

  const slides = Array.from(
    banner.querySelectorAll(".banner1, .banner2, .banner3")
  );
  if (!slides.length) return;

  const SLIDE_DURATION = 4500; // как долго живёт слайд
  let current = 0;
  let timer = null;
  let paused = false;

  // Собираем анимируемые элементы внутри каждого слайда
  slides.forEach((slide) => {
    const items = slide.querySelectorAll(
      ".logo, .title1, .title2, .title3, .text1, .text3, .qr, .disc"
    );
    // Прогрессивная задержка появления — красивый «каскад»
    Array.from(items).forEach((el, i) => {
      el.style.setProperty("--delay", `${i * 110}ms`);
    });
  });

  // ---- Индикаторы (точки) ----
  const dotsWrap = document.createElement("div");
  dotsWrap.className = "slider-dots";
  const dots = slides.map((_, i) => {
    const d = document.createElement("button");
    d.type = "button";
    d.className = "slider-dot" + (i === 0 ? " is-active" : "");
    d.setAttribute("aria-label", `Слайд ${i + 1}`);
    d.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      goTo(i);
      restartTimer();
    });
    dotsWrap.appendChild(d);
  });
  banner.appendChild(dotsWrap);

  function setActiveDot(index) {
    dots.forEach((d, i) => d.classList.toggle("is-active", i === index));
  }

  // ---- Логика переключения ----
  function showSlide(index) {
    slides.forEach((slide, i) => {
      const isActive = i === index;
      slide.classList.toggle("is-active", isActive);
      if (isActive) {
        // перезапуск каскадной анимации содержимого
        slide.classList.remove("is-entering");
        void slide.offsetWidth; // форсируем reflow, чтобы анимация стартовала заново
        slide.classList.add("is-entering");
      }
    });
    setActiveDot(index);
  }

  function goTo(index) {
    current = ((index % slides.length) + slides.length) % slides.length;
    showSlide(current);
  }

  function next() {
    goTo(current + 1);
  }

  // ---- Автопрокрутка с паузой при наведении ----
  function startTimer() {
    stopTimer();
    if (!paused) timer = setInterval(next, SLIDE_DURATION);
  }
  function stopTimer() {
    if (timer) clearInterval(timer);
    timer = null;
  }
  function restartTimer() {
    startTimer();
  }

  banner.addEventListener("mouseenter", () => {
    paused = true;
    stopTimer();
  });
  banner.addEventListener("mouseleave", () => {
    paused = false;
    startTimer();
  });

  // ---- Управление свайпом (для тач-устройств) ----
  let touchX = null;
  banner.addEventListener(
    "touchstart",
    (e) => {
      touchX = e.touches[0].clientX;
      paused = true;
      stopTimer();
    },
    { passive: true }
  );
  banner.addEventListener(
    "touchend",
    (e) => {
      if (touchX === null) return;
      const dx = e.changedTouches[0].clientX - touchX;
      if (Math.abs(dx) > 30) goTo(current + (dx < 0 ? 1 : -1));
      touchX = null;
      paused = false;
      startTimer();
    },
    { passive: true }
  );

  // Уважаем настройку «уменьшить движение»
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // ---- Старт ----
  showSlide(0);
  if (!reduceMotion) startTimer();
})();
