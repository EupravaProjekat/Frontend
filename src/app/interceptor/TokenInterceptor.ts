import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpInterceptor,
  HttpEvent
} from '@angular/common/http';


import { Observable, } from 'rxjs/internal/Observable';
import {AuthService} from "../services/auth.service";
import {JwtHelperService} from "@auth0/angular-jwt";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(public auth: AuthService, public jwtHelper: JwtHelperService) { }
  public isAuthenticated(): boolean {
    const token = localStorage.getItem('jwt');
    return !this.jwtHelper.isTokenExpired(token);
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {


    if(this.isAuthenticated())
    {
      request = request.clone({
        setHeaders: {
          jwt: `${localStorage.getItem("jwt")}`
        }
      });
    }
    return next.handle(request);
  }
}
