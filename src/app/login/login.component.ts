import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { AuthService } from '../services/auth.service';
@Component({
  selector: 'app-login.component',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  passwordFieldType: string = 'password';
  siteKey: string = "6LfPddMpAAAAAOhwDmkeCFnKAGAtvdIqDkYOeVVF";

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private dialog: MatDialog,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      recaptcha: ['', Validators.required]
    });
  }

  openDialog(message: string) {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: { message: message },
    });

    dialogRef.afterClosed().subscribe(() => {
      if (message === 'Login successful') {
        this.router.navigate(['/profile']);
      }
    });
  }

  togglePassword() {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }
  submitForm() {

    const username = this.loginForm.get('username')?.value;
    const password = this.loginForm.get('password')?.value;

    if (!username || !password) {
      this.openDialog('Both username and password are required.');
      this.setRedBorderForField('username')
      this.setRedBorderForField('password')
      return;
    }
    if (this.loginForm.invalid) {
      this.openDialog("Captcha is required!")
      this.setYellowBorderForField('username')
      this.setYellowBorderForField('password')
      return;
    }
    const credentials = {
      email: username,
      password: password
    };
    this.setGreenBorderForField('username')
    this.setGreenBorderForField('password')
    this.authService.login(credentials)

  }

  setGreenBorderForField(inputId: string) {
    const control = this.loginForm.get(inputId);
    if (control) {
      const inputElement = document.getElementById(inputId);
      if (inputElement) {
        inputElement.style.border = '2.5px solid green';
      }
    }
  }

  setYellowBorderForField(inputId: string) {
    const control = this.loginForm.get(inputId);
    if (control) {
      const inputElement = document.getElementById(inputId);
      if (inputElement) {
        inputElement.style.border = '2.5px solid yellow';
      }
    }
  }

  setRedBorderForField(inputId: string) {
    const control = this.loginForm.get(inputId);
    if (control) {
      const inputElement = document.getElementById(inputId);
      if (inputElement) {
        inputElement.style.border = '2.5px solid red';
      }
    }
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  logout(): void {
    localStorage.removeItem('jwt');
    this.router.navigate(['/login']);
  }
}
