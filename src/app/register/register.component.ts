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

  constructor(private fb: FormBuilder, private router: Router, private dialog: MatDialog,private auth: AuthService, private service : UserService, private config: ConfigService) {


    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      passwordConfirm: ['', [Validators.required, Validators.minLength(6)]],
      recaptcha: ['', Validators.required]
    });
  }

  siteKey: string = "6LfPddMpAAAAAOhwDmkeCFnKAGAtvdIqDkYOeVVF";



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
      this.openDialog('All fields are required.');
      this.setBorderForField();
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(registerForm.value.email)) {
      this.setRedBorderForField('email')
      this.openDialog('Invalid email address.');
      return false;
    }
    else{
      this.setGreenBorderForField('email')
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{7,}$/;
    if (registerForm.value.password !== registerForm.value.passwordConfirm || !passwordRegex.test(registerForm.value.password)) {
      this.setRedBorderForField('password')
      this.setRedBorderForField('confirmPassword')
      this.openDialog('Passwords must match and contain at least one lowercase letter, one uppercase letter, one number, and one special character. Password must be at least 7 characters long.');
      return false;
    }
    else{
      this.setGreenBorderForField('password')
      this.setGreenBorderForField('confirmPassword')
    }

    this.setInvalidClass('email', !emailRegex.test(registerForm.value.email));
    this.setInvalidClass('password', registerForm.value.password !== registerForm.value.confirmPassword || !passwordRegex.test(registerForm.value.password));
    this.setInvalidClass('confirmPassword', registerForm.value.password !== registerForm.value.confirmPassword || !passwordRegex.test(registerForm.value.password));

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

  setGreenBorderForField(inputId: string) {
    const control = this.registerForm.get(inputId);
    if (control) {
      const inputElement = document.getElementById(inputId);
      if (inputElement) {
        inputElement.style.border = '2.5px solid green';
      }
    }
  }

  setRedBorderForField(inputId: string) {
    const control = this.registerForm.get(inputId);
    if (control) {
      const inputElement = document.getElementById(inputId);
      if (inputElement) {
        inputElement.style.border = '2.5px solid red';
      }
    }
  }

  setBorderForField(inputId?: string, color: 'red' | 'green' = 'red') {
    if (inputId) {
      const control = this.registerForm.get(inputId);
      if (control && control.value === '') {
        const inputElement = document.getElementById(inputId);
        if (inputElement) {
          inputElement.style.border = `2.5px solid ${color}`;
        }
      }
    } else {
      Object.keys(this.registerForm.controls).forEach((field) => {
        const control = this.registerForm.get(field);
        if (control && control.value === '') {
          const inputElement = document.getElementById(field);
          if (inputElement) {
            inputElement.style.border = `2.5px solid ${color}`;
          }
        }
      });
    }
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

