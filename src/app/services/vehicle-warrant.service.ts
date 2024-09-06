import {HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { DialogComponent } from '../dialog/dialog.component';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class VehicleWarrantService {

  token: any;
  constructor(
    public jwtHelper: JwtHelperService,
    private http: HttpClient,
    private config: ConfigService,
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private authService: AuthService
  ) { }


  // @ts-ignore
  submitAppointmentRequest(requestData: any): Subscription {
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    });

    this.token = localStorage.getItem('jwt');
    let s = this.jwtHelper.decodeToken(this.token)

    const body = {
      'plates': requestData.carPlateNumber,
    };

   

    return this.apiService.post(this.config._warrant_Vehicle_url, JSON.stringify(body), headers).subscribe((res) => {
        this.openDialog("Успешно креиран термин!");
        console.log(res)
        let returnUrl : String;
        returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        this.router.navigate([returnUrl + "/"]);
      },
      (error) => {
        console.error(error);
        this.openDialog("Серверска грешка!");
      }
    );
  }



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
}
