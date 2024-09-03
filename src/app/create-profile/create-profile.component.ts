import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DialogComponent } from '../dialog/dialog.component';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-create-profile',
  templateUrl: './create-profile.component.html',
  styleUrl: './create-profile.component.css'
})
export class CreateProfileComponent {
  profileSetupForm: FormGroup;
  birthday: any;
  minDate: Date = new Date(1900, 0, 1); // Minimalni datum
  maxDate: Date = new Date();

  constructor(private router: Router, private fb: FormBuilder, private dialog: MatDialog, private auth: AuthService, private userService: UserService) {
    this.profileSetupForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      birthday: new FormControl(null, Validators.required),
      gender: ['', Validators.required],
      phone: ['', Validators.required],
      street: ['', Validators.required],
      streetNumber: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      jmbg: ['', Validators.required],
      username: ['', Validators.required]
    });
  }
  isAuthenticated(): boolean {
    return this.auth.isAuthenticated();
  }

  logout(): void {
    localStorage.removeItem('jwt');
    this.router.navigate(['/login']);
  }

  openDialog(message: string) {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: { title: 'Обавештење', message: message },
    });

    dialogRef.afterClosed().subscribe(() => {
      if (message === 'Профил успешно креиран') {
        this.router.navigate(['/login']);
      }
    });
  }

  areFieldsEmpty(): boolean {
    let isEmpty = false;
    Object.keys(this.profileSetupForm.controls).forEach((field) => {
      const control = this.profileSetupForm.get(field);
      if (control && control.value === '') {
        isEmpty = true;
        this.setInvalidClass(field, true);
      }
    });
    return isEmpty;
  }

  setInvalidClass(controlName: string, condition?: boolean): boolean {
    const control = this.profileSetupForm.get(controlName);

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

  checkForm(profileSetupForm: FormGroup): boolean {

    if (this.areFieldsEmpty()) {
      this.openDialog('Молимо вас да попуните сва поља!');
      return false;
    }

    const phoneRegex = /^\d{8,15}$/;
    if (!phoneRegex.test(profileSetupForm.value.phone)) {
      this.openDialog('Неисправан број телефона!');
      return false;
    }

    const jmbgRegex = /^\d{13}$/;
    if (!jmbgRegex.test(profileSetupForm.value.jmbg)) {
      this.openDialog('Неисправан ЈМБГ!');
      return false;
    }

    // Validacija dodatnih polja
    const nameRegex = /^[a-zA-Z]+$/; // Regex za ime i prezime - samo slova
    if (!nameRegex.test(profileSetupForm.value.firstname) || !nameRegex.test(profileSetupForm.value.lastname)) {
      this.openDialog('Име и презиме могу садржавати само слова!');
      return false;
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/; // Format datuma YYYY-MM-DD
    if (!dateRegex.test(profileSetupForm.value.birthday)) {
      this.openDialog('Неисправан формат датума рођења!');
      return false;
    }

    const genderValues = ['male', 'female', 'other']; // Dozvoljene vrednosti za polje 'gender'
    if (!genderValues.includes(profileSetupForm.value.gender)) {
      this.openDialog('Неисправна вредност за пол!');
      return false;
    }

    const streetNumberRegex = /^\d+$/; // Samo brojevi za 'streetNumber'
    if (!streetNumberRegex.test(profileSetupForm.value.streetNumber)) {
      this.openDialog('Неисправан број за улицу!');
      return false;
    }

    // Dodajte validaciju za ostala polja...

    return true;
  }


  submitForm() {
    if (this.checkForm(this.profileSetupForm) == true) {
      // this.userService.saveUser(this.profileSetupForm.value)
      this.router.navigate(['/login'])
    }
  }
}
