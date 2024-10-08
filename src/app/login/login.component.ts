import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { TwoButtonsDialogComponent } from '../two-buttons-dialog/two-buttons-dialog.component';
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
    private userService: UserService,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      recaptcha: ['', Validators.required]
    });
  }

  openDialog(message: string) {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: { title: 'Обавештење', message: message },
    });

    dialogRef.afterClosed().subscribe(() => {
      if (message === 'Login successful') {
        this.router.navigate(['/profile']);
      }
    });
  }

  openTwoButtonsDialog(message: string): void{
    const dialogRef = this.dialog.open(TwoButtonsDialogComponent, {
      data: { title: 'Обавештење', message: message }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'operator') {
        this.userService.bordersaveuser('operator').subscribe(() => {
          this.router.navigate(['/home-guest']);
        });
      } else if (result === 'guest') {
        this.userService.bordersaveuser('guest').subscribe(() => {
          this.router.navigate(['/home-guest']);
        });
      }
    });
  }

  togglePassword() {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }
  submitForm() {

    const email = this.loginForm.get('email')?.value;
    const password = this.loginForm.get('password')?.value;

    if (!email || !password) {
      this.openDialog('Молимо Вас да унесете све креденцијале за пријаву!');
      return;
    }
    if (this.loginForm.invalid) {
      this.openDialog("Captcha is required!")
      return;
    }
    const credentials = {
      email: email,
      password: password
    };
    this.authService.login(credentials)

  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  logout(): void {
    localStorage.removeItem('jwt');
    this.router.navigate(['/login']);
  }
}
