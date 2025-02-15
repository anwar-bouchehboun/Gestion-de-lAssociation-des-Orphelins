import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const loginGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Si l'utilisateur est déjà connecté avec un token valide
  if (authService.isLoggedIn()) {
    // Rediriger vers le dashboard
    router.navigate(['/dashboard']);
    return false;
  }

  // Sinon permettre l'accès à la page de login
  return true;
};
