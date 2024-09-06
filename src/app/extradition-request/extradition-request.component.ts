import {Component, OnInit} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DialogComponent } from '../dialog/dialog.component';
import { AuthService } from '../services/auth.service';
import { BorderPoliceService } from '../services/border-police.service';
import { UserService } from '../services/user.service';
import { TwoButtonsDialogComponent } from '../two-buttons-dialog/two-buttons-dialog.component';

@Component({
  selector: 'app-extradition-request',
  templateUrl: './extradition-request.component.html',
  styleUrl: './extradition-request.component.css'
})
export class ExtraditionRequestComponent implements OnInit{

  requests: any[] = [];
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private dialog: MatDialog,
    private authService: AuthService,
    private userService: UserService,
    private borderPoliceService: BorderPoliceService
  ) {if(this.authService.isAuthenticated())
  {

  }
  else {

    this.router.navigate(['/']);
  }}

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

  ngOnInit() {
    this.authService.checkdataborder();
    this.borderPoliceService.getOne().subscribe((data: any[]) => {
      this.requests = data;
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
  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  logout(): void {
    localStorage.removeItem('jwt');
    this.router.navigate(['/login']);
  }
}
