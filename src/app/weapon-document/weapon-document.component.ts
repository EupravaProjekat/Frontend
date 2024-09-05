import { Component, Type } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DialogComponent } from '../dialog/dialog.component';
import { AuthService } from '../services/auth.service';
import { WeaponDocumentService } from '../services/weapon-document.service';

@Component({
  selector: 'app-weapon-document',
  templateUrl: './weapon-document.component.html',
  styleUrl: './weapon-document.component.css'
})
export class WeaponDocumentComponent {
  weaponForm: FormGroup;
  weaponTypes: string[] = ['Пиштољ', 'Пушка', 'Карабин', 'Секира', 'Пиштољ са дугом цеви', 'Пушка са пумпом', 'Лук и стрела', 'Оружје за самоодбрану'];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private dialog: MatDialog,
    private authService: AuthService,
    private weaponService: WeaponDocumentService
  ) {
    this.weaponForm = this.fb.group({
      weaponType: ['', Validators.required],
      serialNumber: ['', Validators.required],
      caliber: ['', Validators.required]
    });
  }
  checkdatapolice() {
    if (this.authService.checkdata() == false) {
      // this.userService.saveUser(this.profileSetupForm.value)
      this.router.navigate(['/profileSetup'])
    }
  }
  checkdataborder() {
    if (this.authService.checkdataborder() == false) {
      // this.userService.saveUser(this.profileSetupForm.value)
      this.router.navigate(['/profileSetupBorder'])
    }
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


  submitForm() {

    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.openDialog('Грешка приликом добављања података о кориснику!');
      return;
    }

    const weaponData = this.weaponForm.value;
    weaponData.email = currentUser.email;
    this.weaponService.submitWeaponRequest(weaponData).subscribe(
      (response) => {
        console.log('Zahtev za oružje uspešno poslat', response);
        // Ovde možete obavestiti korisnika da je zahtev uspešno poslat
      },
      (error) => {
        console.error('Greška prilikom slanja zahteva za oružje', error);
        // Ovde možete obavestiti korisnika o grešci
      }
    );
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  logout(): void {
    localStorage.removeItem('jwt');
    this.router.navigate(['/login']);
  }
}
