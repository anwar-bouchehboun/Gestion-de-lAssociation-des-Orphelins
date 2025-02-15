import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.prod';
import { HttpHeaders, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  apiUrlLogin = environment.apiUrlLogin;
  apiUrlLogout = environment.apiUrlLogout;

  private readonly TOKEN_KEY = 'auth_token';
  private readonly role = 'role';
  private readonly TWO_HOURS = 2 * 60 * 60 * 1000; // 2 heures en millisecondes

  constructor(private http: HttpClient, private router: Router) {
    // Vérifier le token toutes les 2 heures
    setInterval(() => this.checkTokenExpiration(), this.TWO_HOURS);
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(this.apiUrlLogin, { email, password }).pipe(
      tap((response: any) => {
        if (response && response.token) {
          this.setToken(response.token);
          this.setRole(response.role);
          this.router.navigate(['/dashboard']);
        }
      }),
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Une erreur est survenue';
        if (error.status === 401) {
          errorMessage = 'Email ou mot de passe incorrect';
        } else if (error.status === 403) {
          errorMessage = 'Accès non autorisé';
        }
        return throwError(() => errorMessage);
      })
    );
  }

  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  setRole(role: string): void {
    localStorage.setItem(this.role, role);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getRole(): string | null {
    return localStorage.getItem(this.role);
  }

  removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.role);
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      // Vérifier si le token est valide et non expiré
      const decodedToken: any = jwtDecode(token);
      if (!decodedToken.exp) return false;

      const expirationDate = new Date(0);
      expirationDate.setUTCSeconds(decodedToken.exp);
      const isExpired = expirationDate.valueOf() <= new Date().valueOf();

      if (isExpired) {
        this.handleTokenExpiration();
        return false;
      }

      return true;
    } catch {
      this.handleTokenExpiration();
      return false;
    }
  }

  getDecodedToken(): any {
    const token = this.getToken();
    if (!token) return null;
    try {
      return jwtDecode(token);
    } catch (error) {
      console.error('Erreur lors du décodage du token:', error);
      return null;
    }
  }

  private handleTokenExpiration(): void {
    this.removeToken();
    // Rediriger vers login avec un message d'expiration
    this.router.navigate(['/login'], {
      queryParams: {
        expired: true,
        message: 'Votre session a expiré. Veuillez vous reconnecter.',
      },
    });
  }

  private checkTokenExpiration(): void {
    const token = this.getToken();
    if (!token) return;

    try {
      const decodedToken: any = jwtDecode(token);
      if (!decodedToken.exp) return;

      const expirationDate = new Date(0);
      expirationDate.setUTCSeconds(decodedToken.exp);
      const isExpired = expirationDate.valueOf() <= new Date().valueOf();

      if (isExpired) {
        this.handleTokenExpiration();
      }
    } catch {
      this.handleTokenExpiration();
    }
  }

  getUserRole(): string | null {
    const decodedToken = this.getDecodedToken();
    return decodedToken ? decodedToken.role : null;
  }

  getUserEmail(): string | null {
    const decodedToken = this.getDecodedToken();
    return decodedToken ? decodedToken.sub : null;
  }
  getUserName(): string | null {
    const decodedToken = this.getDecodedToken();
    return decodedToken ? decodedToken.username : null;
  }

  logout(): void {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.getToken()}`
    );

    this.http
      .post(this.apiUrlLogout, {}, { headers, responseType: 'text' })
      .subscribe(
        () => {
          this.removeToken();
          this.router.navigate(['/login']);
          console.log('Déconnexion réussie');
        },
        (error) => {
          console.error('Erreur lors de la déconnexion:', error);
        }
      );
  }
}
