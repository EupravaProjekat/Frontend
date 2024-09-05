import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DialogComponent } from '../dialog/dialog.component';
import { AuthService } from '../services/auth.service';
import { BorderPoliceService } from '../services/border-police.service';

@Component({
  selector: 'app-special-vehicle',
  templateUrl: './special-vehicle.component.html',
  styleUrl: './special-vehicle.component.css'
})
export class SpecialVehicleComponent{


  specialVehicleForm: FormGroup;
  requestTypes: string[] = ['Превоз опасног терета', 'Превоз прекомерно тешког терета'];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private dialog: MatDialog,
    private authService: AuthService,
    private borderPoliceService: BorderPoliceService
  ) {
    if(this.authService.isAuthenticated())
    {

    }
    else {

      this.router.navigate(['/']);
    }
    this.specialVehicleForm = this.fb.group({
      requestType: ['', Validators.required],
      carPlateNumber: ['', Validators.required],
      description: ['', Validators.required]
    });
  }
  ngOnInit()  {
    this.authService.checkdata();
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

    const specialVehicleData = this.specialVehicleForm.value;
    specialVehicleData.email = currentUser.email;
    this.borderPoliceService.submitSpecialVehicleRequest(specialVehicleData).subscribe(
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
