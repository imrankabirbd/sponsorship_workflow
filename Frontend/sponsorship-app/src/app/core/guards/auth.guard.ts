import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

    // Check if user is logged in
    if (this.authService.isLoggedIn()) {
      return true;
    }

    // Not logged in, redirect to login page
    this.router.navigate(['/auth/login'], {
      queryParams: { returnUrl: state.url }
    });

    return false;
  }
}
