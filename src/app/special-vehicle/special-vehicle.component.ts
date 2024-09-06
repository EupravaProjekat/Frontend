import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DialogComponent } from '../dialog/dialog.component';
import { AuthService } from '../services/auth.service';
import { BorderPoliceService } from '../services/border-police.service';
import { UserService } from '../services/user.service';
import { TwoButtonsDialogComponent } from '../two-buttons-dialog/two-buttons-dialog.component';

@Component({
  selector: 'app-special-vehicle',
  templateUrl: './special-vehicle.component.html',
  styleUrl: './special-vehicle.component.css'
})
export class SpecialVehicleComponent{


  specialVehicleForm: FormGroup;
  requestTypes: string[] = ['Прелазак возила са ванредним димензијама', 'Прелазак возила са посебном наменом'];

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
    this.specialVehicleForm = this.fb.group({
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
