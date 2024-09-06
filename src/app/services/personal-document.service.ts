import {HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, Subscription } from 'rxjs';
import { DialogComponent } from '../dialog/dialog.component';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class PersonalDocumentService {

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


  submitAppointmentRequest(requestData: any): Subscription {
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    });

    this.token = localStorage.getItem('jwt');
    let s = this.jwtHelper.decodeToken(this.token)

    let timeFrom = requestData.time.split('-')[0]
    let timeTo = requestData.time.split('-')[1]

    const body = {
      'email': requestData.email,
      'name' : requestData.name,
      'surname' : requestData.surname,
      'jmbg' : requestData.jmbg,
      'request_number' : requestData.requestNumber,
      'date' : requestData.date,
      'timeFrom' : timeFrom,
      'timeTo' : timeTo
    };

    console.log(requestData.email)

    return this.apiService.post(this.config._document_request_url, JSON.stringify(body), headers).subscribe((res) => {
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
