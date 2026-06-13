import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRoles = route.data['roles'] as Array<string>;
    const userRole = this.authService.getCurrentUserRole();

    if (!userRole) {
      this.router.navigate(['/auth/login']);
      return false;
    }

    if (expectedRoles && expectedRoles.includes(userRole)) {
      return true;
    }

    switch(userRole) {
      case 'Requestor':
        this.router.navigate(['/requestor/my-requests']);
        break;
      case 'Manager':
        this.router.navigate(['/manager/pending']);
        break;
      case 'FinanceAdmin':
        this.router.navigate(['/finance/review']);
        break;
      case 'SystemAdmin':
        this.router.navigate(['/admin/all-requests']);
        break;
      default:
        this.router.navigate(['/auth/login']);
    }

    return false;
  }
}
