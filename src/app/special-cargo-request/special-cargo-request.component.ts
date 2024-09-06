import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DialogComponent } from '../dialog/dialog.component';
import { AuthService } from '../services/auth.service';
import { BorderPoliceService } from '../services/border-police.service';
import { UserService } from '../services/user.service';
import { TwoButtonsDialogComponent } from '../two-buttons-dialog/two-buttons-dialog.component';

@Component({
  selector: 'app-special-cargo-request',

  templateUrl: './special-cargo-request.component.html',
  styleUrl: './special-cargo-request.component.css'
})
export class SpecialCargoRequestComponent {


  specialCargoRequestForm: FormGroup;
  requestTypes: string[] = ['Превоз опасног терета', 'Превоз прекомерно тешког терета'];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private dialog: MatDialog,
    private authService: AuthService,
    private userService: UserService,
    private borderPoliceService: BorderPoliceService
  ) {
    if(this.authService.isAuthenticated())
    {

    }
    else {

      this.router.navigate(['/']);
    }
    this.specialCargoRequestForm = this.fb.group({
      requestType: ['', Validators.required],
      carPlateNumber: ['', Validators.required],
      description: ['', Validators.required]
    });
  }
  ngOnInit()  {
    this.authService.checkdata();
    this.authService.checkdataborder();
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

    const specialCargoRequestData = this.specialCargoRequestForm.value;
    specialCargoRequestData.email = currentUser.email;
    this.borderPoliceService.submitSpecialCargoRequestDataRequest(specialCargoRequestData).subscribe(
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
