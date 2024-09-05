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
import { UserService } from './user.service';

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
    private dialog: MatDialog,
    private userService: UserService

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
  checkdata(): Subscription {
    const loginHeaders = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    });


     return this.apiService.get(this.config._check_url, loginHeaders)
      .subscribe((res) => {
          console.log('data check success');
        if(res.status != 200)
        {
          this.router.navigate(['/profileSetup']);
        }
        },
        (error) => {
          this.router.navigate(['/profileSetup']);
        }
      );
  }
  checkdataborder() : Subscription {
    const loginHeaders = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    });


    return this.apiService.get(this.config._check_border_url, loginHeaders)
      .subscribe((res) => {
          console.log('data check success');
        console.log(res.status);
          if(res.status != 200)
          {
            this.router.navigate(['/profileSetupborder']);
          }
        },
(error) => {
  this.router.navigate(['/profileSetupborder']);
}
      );
  }
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
          localStorage.setItem("jwt", res.body);
          console.log(res.body);
          console.log(res);

          this.userService.getOne(user.email).subscribe((username) => {
            if (!username) {
              this.router.navigate(['/profileSetup']);
            } else {
              this.router.navigate(['/']);
            }
          });
        },
        (error) => {
          this.openDialog('Погрешни креденцијали за пријаву!');
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

  sendResetRequest(user: any): Subscription{
    const resetHeaders = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    });

    const body = {
      'email': user.email
    };

    return this.apiService.post(this.config._reset_request_url, JSON.stringify(body), resetHeaders)
      .subscribe((res) => {
          console.log('Reset request success');
          this.openDialog('Reset request success');
          console.log(res.body)
          console.log(res)
        },(error) => {
          this.openDialog('Грешка!');
        }
      )
  }

  resetPassword(email: string, ticketReset: string, newPassword: string): Subscription {
    const resetHeaders = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    });

    const body = {
      'email': email,
      'ticketReset': ticketReset,
      'newPassword': newPassword
    };

    return this.apiService.post(this.config._reset_password_url, JSON.stringify(body), resetHeaders)
      .subscribe(
        (res) => {
          console.log('Reset password success');
          this.openDialog('Reset password success');
          console.log(res.body);
          console.log(res);
          // Optionally, you can navigate to a different route after a successful password reset
          this.router.navigate(['/login']);
        },
        (error) => {
          console.error('Reset password failed', error);
          this.openDialog('Reset password failed');
          // Handle error, show appropriate message to the user
        }
      );
  }

}
