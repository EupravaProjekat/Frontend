// auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private jwtHelper: JwtHelperService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const token = localStorage.getItem('jwt');

    if (!token || this.jwtHelper.isTokenExpired(token)) {
      this.router.navigate(['/login']);
      return false;
    }

    if ('role' in route.data && !this.checkRoles(token)) {
      this.router.navigate(['/login']);
      return false;
    }

    return true;
  }

  private checkRoles(token: string): boolean {
    const decodedToken = this.jwtHelper.decodeToken(token);
    return !!decodedToken.role;
  }

}
