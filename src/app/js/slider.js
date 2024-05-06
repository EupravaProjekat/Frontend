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




  let parameters = {
    count : false,
    letters : false,
    numbers : false,
    special : false
  }
  let strengthBar = document.getElementById("strength-bar");
  let msg = document.getElementById("msg");

  function strengthChecker() {
    let password = document.getElementById("password").value;

    parameters.letters = (/[A-Za-z]+/.test(password))?
      true:false;
    parameters.numbers = (/[0-9]+/.test(password))?
      true:false;
    parameters.special = (/[!\"$%&/()=?@~`\\.\';:+=^*_-]+/.test(password))?true:false;
    parameters.count = (password.length > 7)?true:false;

    let barLength = Object.values(parameters).filter((value=>value));

    strengthBar.innerHTML = "";
    for(let i in barLength) {
      let span = document.createElement("span");
      span.classList.add("strength");
      strengthBar.appendChild(span);
    }

    let spanRef = document.getElementsByClassName("strength");
    for (let i = 0; i < spanRef.length; i++) {
      switch (spanRef.length - 1) {
        case 0 :
          spanRef[i].style.background = "#ff3e36";
          msg.textContent = "Ваша лозинка је веома слаба";
          break;

        case 1 :
          spanRef[i].style.background = "#ff691f";
          msg.textContent = "Ваша лозинка је слаба";
          break;

        case 2 :
          spanRef[i].style.background = "#ffda36";
          msg.textContent = "Ваша лозинка је добра";
          break;

        case 3 :
          spanRef[i].style.background = "#0be881";
          msg.textContent = "Ваша лозинка је јака";
          break;
      }
    }
  }
}
