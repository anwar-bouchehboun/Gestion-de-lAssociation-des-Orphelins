import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly role = 'role';
  apiUrlLogin = environment.apiUrlLogin;
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
        } else {
          console.log('Erreur lors de la connexion');
        }
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
    return !this.isTokenExpired(token);
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

  isTokenExpired(token: string): boolean {
    try {
      const decodedToken: any = jwtDecode(token);
      if (!decodedToken.exp) return true;
      const expirationDate = new Date(0);
      expirationDate.setUTCSeconds(decodedToken.exp);
      const isExpired = expirationDate.valueOf() <= new Date().valueOf();

      if (isExpired) {
        this.handleTokenExpiration();
      }

      return isExpired;
    } catch {
      this.handleTokenExpiration();
      return true;
    }
  }

  private handleTokenExpiration(): void {
    this.removeToken();
    this.router.navigate(['/login']);
  }

  private checkTokenExpiration(): void {
    const token = this.getToken();
    if (token && this.isTokenExpired(token)) {
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
}
