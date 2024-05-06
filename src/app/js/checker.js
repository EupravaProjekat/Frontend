// password-strength.js

document.addEventListener("DOMContentLoaded", function() {
  function strengthChecker() {
    let parameters = {
      count: false,
      letters: false,
      numbers: false,
      special: false
    }
    let strengthBars = document.getElementsByClassName("strength-bar");
    let msg = document.getElementById("msg");

    let password = document.getElementById("password").value;

    if (password.length === 0) {
      // Ako je polje za lozinku prazno, sakrijemo poruku
      msg.textContent = "";
      for (let strengthBar of strengthBars) {
        strengthBar.innerHTML = "";
      }
      return; // Prekidamo izvršavanje funkcije
    }

    parameters.letters = /[A-Za-z]+/.test(password);
    parameters.numbers = /[0-9]+/.test(password);
    parameters.special = /[!\"$%&/()=?@~`\\.\';:+=^*_-]+/.test(password);
    parameters.count = password.length >= 7;

    for (let strengthBar of strengthBars) {

      for (let key in parameters) {
        if (parameters[key]) {
          let span = document.createElement("span");
          span.classList.add("strength");
          strengthBar.appendChild(span);
        }
      }
    }

    let strengthLevel = 0;
    for (let key in parameters) {
      if (parameters[key]) strengthLevel++;
    }

    switch (strengthLevel) {
      case 0:
        msg.textContent = "";
        for (let strengthBar of strengthBars) {
          strengthBar.style.background = "transparent";
          strengthBar.style.width = "0";
        }
        break;
      case 1:
        msg.textContent = "Your password is very weak";
        for (let strengthBar of strengthBars) {
          if (strengthBar.children.length === 1) {
            strengthBar.children[0].style.background = "#ff3e36";
            strength.style.width = "25%";
            strength.style.height="100%";
          }
        }
        break;
      case 2:
        msg.textContent = "Your password is weak";
        for (let strengthBar of strengthBars) {
          if (strengthBar.children.length === 1) {
            strengthBar.children[0].style.background = "#ff691f";
            strengthBar.children[0].style.width = "50%";
          }
        }
        break;
      case 3:
        msg.textContent = "Your password is good";
        for (let strengthBar of strengthBars) {
          if (strengthBar.children.length === 1) {
            strengthBar.children[0].style.background = "#ffda36";
            strengthBar.style.width = "75%";
          }
        }
        break;
      case 4:
        msg.textContent = "Your password is strong";
        for (let strengthBar of strengthBars) {
          if (strengthBar.children.length === 1) {
            strengthBar.children[0].style.background = "#0be881";
            strengthBar.style.width = "100%";
          }
        }
        break;
    }
  }



  let passwordField = document.getElementById("password");
  let passwordConfirmField = document.getElementById("passwordConfirm");

  passwordField.addEventListener("input", function() {
    strengthChecker();
  });

  passwordConfirmField.addEventListener("input", function() {
    strengthChecker();
  });
});
