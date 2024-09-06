import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from './auth.service';
import { ConfigService } from './config.service';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProsecutionServiceService {

  constructor(
    private http: HttpClient,
    private config: ConfigService,
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private authService: AuthService
  ) { }

  checkIfUserIsProsecuted(jmbg: any) {
    const body = { 'jmbg': jmbg };
    return this.apiService.post(this.config._prosecution_check_url, JSON.stringify(body)).pipe(
      catchError(error => {
        // Handle error here, possibly logging or showing an alert
        return throwError(error);
      })
    );
  }
  
  prosecute(jmbg: any, typeOfBreach: number) {
    const body = {
      'jmbg': jmbg,
      'typeOfBreach': typeOfBreach
    };
    return this.apiService.post(this.config._prosecute_url, JSON.stringify(body)).pipe(
      catchError(error => {
        // Handle error here
        return throwError(error);
      })
    );
  }
}
