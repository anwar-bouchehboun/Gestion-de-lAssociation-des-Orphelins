import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const userRole = this.authService.getUserRole();
    const requiredRoles = route.data['roles'] as string[];

    if (!userRole || !requiredRoles.includes(userRole)) {
      this.router.navigate(['/dashboard']);
      return false;
    }

    return true;
  }
}
