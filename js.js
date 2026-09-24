// Слайдер для баннера
(function() {
  const slides = document.querySelectorAll('.banner1, .banner2, .banner3');
  let currentSlide = 0;
  const slideInterval = 3000; 
  
  
  function nextSlide() {
    
    // slides[currentSlide].style.opacity = '0';
    slides[currentSlide].style.display = 'none';
    
   
    currentSlide = (currentSlide + 1) % slides.length;
    
    
    slides[currentSlide].style.opacity = '1';
    slides[currentSlide].style.display = 'flex';
  }
  
  
  setInterval(nextSlide, slideInterval);
})();


