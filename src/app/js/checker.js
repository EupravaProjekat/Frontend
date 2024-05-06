document.addEventListener("DOMContentLoaded", function() {
  function strengthChecker() {
    let parameters = {
      count: false,
      letters: false,
      numbers: false,
      special: false
    }
    let strengthBar = document.querySelector(".strength-bar");
    let msg = document.getElementById("msg");
    let password = document.getElementById("password").value;
    let confirmPasswordLayout = document.getElementById("confirmPasswordLayout");

      confirmPasswordLayout.style.marginTop = "15px";

    if (password.length === 0) {
      msg.style.display = "none";
    } else {
      msg.style.display = "block";
    }

    parameters.letters = /[A-Za-z]+/.test(password);
    parameters.numbers = /[0-9]+/.test(password);
    parameters.special = /[!\"$%&/()=?@~`\\.\';:+=^*_-]+/.test(password);
    parameters.count = password.length >= 9;

    let strength = document.getElementsByClassName("strength")[0]; // Pristup prvoj stavci u kolekciji
    let strengthLevel = 0;
    let key = "count";
    while (key !== "") {
      if (parameters[key]) strengthLevel++;
      switch (key) {
        case "count":
          key = "letters";
          break;
        case "letters":
          key = "numbers";
          break;
        case "numbers":
          key = "special";
          break;
        case "special":
          key = "";
          break;
      }
    }

    switch (strengthLevel) {
      case 0:
        msg.textContent = "";
        strength.style.width = "0%";
        confirmPasswordLayout.style.marginTop = "0";
        break;
      case 1:
        msg.innerText = "Ваша лозинка је веома слаба";
        strength.style.backgroundColor = "#ff0000";
        strength.style.width = "25%";
        confirmPasswordLayout.style.marginTop = "15px";
        break;
      case 2:
        msg.textContent = "Ваша лозинка је слаба";
        strength.style.backgroundColor = "#ffb500";
        strength.style.width = "50%";
        confirmPasswordLayout.style.marginTop = "15px";
        break;
      case 3:
        msg.textContent = "Ваша лозинка је јака";
        strength.style.backgroundColor = "#e9ff00";
        strength.style.width = "75%";
        confirmPasswordLayout.style.marginTop = "15px";
        break;
      case 4:
        msg.textContent = "Ваша лозинка je веома jaka";
        strength.style.backgroundColor = "#07d000";
        strength.style.width = "100%";
        confirmPasswordLayout.style.marginTop = "15px";
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
