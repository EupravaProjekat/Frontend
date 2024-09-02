import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DialogComponent } from '../dialog/dialog.component';
import { AuthService } from '../services/auth.service';
import { PersonalDocumentService } from '../services/personal-document.service';

@Component({
  selector: 'app-personal-document',
  templateUrl: './personal-document.component.html',
  styleUrl: './personal-document.component.css'
})
export class PersonalDocumentComponent {

  documentForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private dialog: MatDialog,
    private authService: AuthService,
    private documentService: PersonalDocumentService
  ) {
    this.documentForm = this.fb.group({
      weaponType: ['', Validators.required],
      serialNumber: ['', Validators.required],
      caliber: ['', Validators.required]
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
  submitForm() {

    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.openDialog('Грешка приликом добављања података о кориснику!');
      return;
    }

    const requestData = this.documentForm.value;
    requestData.email = currentUser.email;
    this.documentService.submitAppointmentRequest(requestData).subscribe(
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
