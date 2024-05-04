import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpStatusCode} from '@angular/common/http';
import {DialogComponent} from "../dialog/dialog.component";
import { JwtHelperService } from '@auth0/angular-jwt';
import {MatDialog} from "@angular/material/dialog";
import { ConfigService} from '../services/config.service';
import {catchError, map, tap} from 'rxjs/operators';
import {ActivatedRoute, Router} from '@angular/router';
import {ApiService} from "../services/api.service";
import {Observable, Subscription, throwError} from "rxjs";

@Injectable({providedIn: 'root'})
export class AuthService {
  token:any
  getDecodedAccessToken(): any {

    this.token = localStorage.getItem('jwt');
    try {
      return this.jwtHelper.decodeToken(this.token);
      console.log(this.token)
    } catch(Error) {
      return null;
    }
  }
  get access_token(): any {
    return this._access_token;
  }

  set access_token(value: any) {
    this._access_token = value;
  }
  constructor(
    public jwtHelper: JwtHelperService,
    private apiService: ApiService,
    private http: HttpClient,
    private config: ConfigService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog

  ) {

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
  public isAuthenticated(): boolean {
    const token = localStorage.getItem('jwt');
    // Check whether the token is expired and return
    // true or false
    if(this.jwtHelper.isTokenExpired(token))
    {
      localStorage.removeItem('jwt');
      return false;
    }
    return true;
  }
  
  private _access_token : any;

  login(user: any): Subscription {
    const loginHeaders = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    });

    const body = {
      'email': user.email,
      'password': user.password,
    };

    return this.apiService.post(this.config._login_url, JSON.stringify(body), loginHeaders)
      .subscribe((res) => {
          console.log('Login success');
          localStorage.setItem("jwt", res.body)
          console.log(res.body)
          console.log(res)
          this.router.navigate(['/profile']);
        },
        (error) => {
          this.openDialog('Wrong credentials');

        }
      );
  }

  logout(): void {
    this._access_token = null;
    localStorage.removeItem('jwt');
  }

  tokenIsPresent() {
    return this._access_token !== undefined && this._access_token !== null;
  }

  getToken() {
    return this._access_token;
  }
  getCurrentUser(): any {
    const token = localStorage.getItem('jwt');
    console.log('Token before decoding:', token);

    if (token) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      console.log('Decoded token:', decodedToken);
      return decodedToken;
    }

    console.log('No token found.');
    return null;
  }

}
