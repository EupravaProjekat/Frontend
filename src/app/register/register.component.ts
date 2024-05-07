import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DialogComponent } from '../dialog/dialog.component';
import { AuthService } from '../services/auth.service';
import { ConfigService } from '../services/config.service';
import { UserService } from '../services/user.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit{
  registerForm: FormGroup;
  passwordFieldType: string = 'password';
  siteKey: string = "6LfPddMpAAAAAOhwDmkeCFnKAGAtvdIqDkYOeVVF";

  constructor(private fb: FormBuilder, private router: Router, private dialog: MatDialog,private auth: AuthService, private service : UserService, private config: ConfigService) {


    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      passwordConfirm: ['', [Validators.required, Validators.minLength(6)]],
      recaptcha: ['', Validators.required]
    });
  }



  openDialog(message: string) {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: { message: message },
    });

    dialogRef.afterClosed().subscribe(() => {
      if (message === 'Registration successful') {
        this.router.navigate(['/login']);
      }
    });
  }

  ngOnInit(): void {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = '../js/checker.js';
    document.body.appendChild(script);
  }

  checkForm(registerForm: FormGroup): boolean {

    if (this.areFieldsEmpty()) {
      this.openDialog('Молимо вас да попуните сва поља!');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(registerForm.value.email)) {
      this.openDialog('Неисправна имејл адреса!');
      return false;
    }
    else{
    }

    if (registerForm.value.password !== registerForm.value.passwordConfirm) {
      this.openDialog('Лозинке се морају подударати!');
      return false;
    }

    let msgElement = document.getElementById("msg");
    let msgText = msgElement?.textContent;

    if (msgText === 'Ваша лозинка је веома слаба' || msgText === 'Ваша лозинка je слаба' || msgText === 'Ваша лозинка је јака') {
      this.openDialog('Лозинка мора садржавати барем 7 карактера, укључујући велика и мала слова, барем један број и барем један специјални карактер!');
      return false;
    }


    return true;
  }

  areFieldsEmpty(): boolean {
    let isEmpty = false;
    Object.keys(this.registerForm.controls).forEach((field) => {
      const control = this.registerForm.get(field);
      if (control && control.value === '') {
        isEmpty = true;
        this.setInvalidClass(field, true);
      }
    });
    return isEmpty;
  }

  setInvalidClass(controlName: string, condition?: boolean): boolean {
    const control = this.registerForm.get(controlName);

    if (condition !== undefined) {
      if (control && condition && (control.dirty || control.touched)) {
        return true;
      } else {
        return false;
      }
    }

    if (control && control.invalid && (control.dirty || control.touched)) {
      return true;
    }

    return false;
  }

  togglePassword() {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  submitForm() {
    if (this.checkForm(this.registerForm) == true) {
      this.service.register(this.registerForm.value)
      this.router.navigate(['/login'])
    }
  }

  isAuthenticated(): boolean {
    return this.auth.isAuthenticated();
  }

  logout(): void {
    localStorage.removeItem('jwt');
    this.router.navigate(['/login']);
  }


}

