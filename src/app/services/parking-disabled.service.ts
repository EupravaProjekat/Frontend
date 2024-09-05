import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {ActivatedRoute, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Subscription } from 'rxjs';
import { DialogComponent } from '../dialog/dialog.component';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class ParkingDisabledService {
  token:any;
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



  submitParkingRequest(requestData: any): Subscription {
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    });

    this.token = localStorage.getItem('jwt');
    let s = this.jwtHelper.decodeToken(this.token)
    

    const body = {
      'city': requestData.city,
      'requestParkingCard': requestData.requestParkingCard,
      'requestReservedParking': requestData.requestReservedParking,
      'firstName': requestData.firstName,
      'lastName': requestData.lastName,
      'idNumber': requestData.idNumber,
      'phone': requestData.phone,
      'email': requestData.email,
      'municipality': requestData.municipality,
      'postalCode': requestData.postalCode,
      'entrance': requestData.entrance,
      'floor': requestData.floor,
      'place': requestData.place,
      'street': requestData.street,
      'streetNumber': requestData.streetNumber,
      'apartment': requestData.apartment,
      'addition': requestData.addition,
      'previousDecision': requestData.previousDecision,
      'propertyVehicle': requestData.propertyVehicle,
      'registrationPlate': requestData.registrationPlate,
      'marka': requestData.marka,
      'model': requestData.model,
      'isLeased': requestData.isLeased
    };

   

    return this.apiService.post(this.config._parking_request_url, JSON.stringify(body), headers).subscribe((res) => {
        this.openDialog("Успешно поднет захтев за паркинг карту!");
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
