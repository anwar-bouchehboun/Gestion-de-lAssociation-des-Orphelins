import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  // Vérification du rôle si nécessaire
  const userRole = authService.getRole();
  const requiredRole = route.data['role'];

  if (requiredRole && userRole !== requiredRole) {
    router.navigate(['/login']);
    return false;
  }

  return true;
};
