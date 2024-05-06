window.onload = function() {
  var slides = document.querySelectorAll('.slide');
  var btns = document.querySelectorAll('.btn-navigate');
  var currentSlide = 0;
  let autoChangeTimeout;

  var manualNav = function(manual) {
    clearInterval(autoChangeTimeout);

    slides.forEach((slide) => {
      slide.classList.remove('active');

      btns.forEach((btn) => {
        btn.classList.remove('active')
      })
    })

    slides[manual].classList.add('active');
    btns[manual].classList.add('active');

    currentSlide = manual;

    autoChangeTimeout = setTimeout(autoChange, 5000);
  }

  btns.forEach((btn, i) => {
    btn.addEventListener("click", () => {
      manualNav(i);
    });
  });

  var autoChange = () => {
    slides[currentSlide].classList.remove('active');
    btns[currentSlide].classList.remove('active');

    if (currentSlide === slides.length - 1) {
      currentSlide = 0;
    } else {
      currentSlide++;
    }

    slides[currentSlide].classList.add('active');
    btns[currentSlide].classList.add('active');

    autoChangeTimeout = setTimeout(autoChange, 5000);
  }

  var repeat = function () {
    autoChange();
  }
  repeat();
  
}
