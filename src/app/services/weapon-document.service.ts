import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { DialogComponent } from '../dialog/dialog.component';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class WeaponDocumentService {

  constructor(
    private http: HttpClient,
    private config: ConfigService,
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private authService: AuthService
  ) { }

  submitWeaponRequest(weaponData: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.authService.getToken()
    });

    return this.http.post<any>(this.config._weapon_request_url, weaponData, { headers: headers });
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
