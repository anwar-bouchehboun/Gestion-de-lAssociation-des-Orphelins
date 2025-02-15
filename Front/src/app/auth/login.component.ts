import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <div class="login-container">
      <div class="form-wrapper">
        <mat-card class="login-card">
          <div class="card-content">
            <!-- Logo Section -->
            <div class="logo-section">
              <div class="logo-container">
                <mat-icon class="logo-icon">favorite</mat-icon>
              </div>
              <h1 class="title">Gestion des Orphelins</h1>
              <p class="subtitle">Connectez-vous à votre compte</p>
            </div>

            <!-- Login Form -->
            <form
              [formGroup]="loginForm"
              (ngSubmit)="onSubmit()"
              class="login-form"
            >
              <!-- Email Field -->
              <div class="form-field">
                <label>Email</label>
                <div class="input-container">
                  <input
                    formControlName="email"
                    type="email"
                    placeholder="Votre email"
                    class="form-input"
                  />
                  <mat-icon class="field-icon">email</mat-icon>
                </div>
                <div
                  *ngIf="loginForm.get('email')?.errors?.['required'] && loginForm.get('email')?.touched"
                  class="error-text"
                >
                  L'email est requis
                </div>
                <div
                  *ngIf="loginForm.get('email')?.errors?.['email'] && loginForm.get('email')?.touched"
                  class="error-text"
                >
                  Format d'email invalide
                </div>
              </div>

              <!-- Password Field -->
              <div class="form-field">
                <label>Mot de passe</label>
                <div class="input-container">
                  <input
                    formControlName="password"
                    [type]="hidePassword ? 'password' : 'text'"
                    placeholder="Votre mot de passe"
                    class="form-input"
                  />
                  <button
                    type="button"
                    (click)="hidePassword = !hidePassword"
                    class="password-toggle"
                  >
                    <mat-icon>{{
                      hidePassword ? 'visibility_off' : 'visibility'
                    }}</mat-icon>
                  </button>
                </div>
                <div
                  *ngIf="loginForm.get('password')?.errors?.['required'] && loginForm.get('password')?.touched"
                  class="error-text"
                >
                  Le mot de passe est requis
                </div>
              </div>

              <!-- Submit Button -->
              <button
                type="submit"
                [disabled]="!loginForm.valid || isLoading"
                class="submit-button"
              >
                <mat-spinner *ngIf="isLoading" [diameter]="20"></mat-spinner>
                <span *ngIf="!isLoading">Se connecter</span>
              </button>

              <!-- Error Message -->
              <div *ngIf="errorMessage" class="error-message">
                <mat-icon>error_outline</mat-icon>
                <span>{{ errorMessage }}</span>
              </div>
            </form>
          </div>
        </mat-card>
      </div>
    </div>
  `,
  styles: [
    `
      /* Container principal */
      .login-container {
        min-height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 1rem;
        background: linear-gradient(135deg, #1e3c74 0%, #e74c3c 100%);
        animation: gradientShift 15s ease infinite;
        background-size: 200% 200%;
      }

      @keyframes gradientShift {
        0% {
          background-position: 0% 50%;
        }
        50% {
          background-position: 100% 50%;
        }
        100% {
          background-position: 0% 50%;
        }
      }

      /* Wrapper de la carte */
      .form-wrapper {
        width: 100%;
        max-width: 420px;
        perspective: 1000px;
      }

      /* Carte de login */
      .login-card {
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(10px);
        border-radius: 20px;
        box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
        border: 1px solid rgba(255, 255, 255, 0.3);
        overflow: hidden;
        transform-style: preserve-3d;
        animation: cardEntry 0.8s ease-out;
      }

      @keyframes cardEntry {
        from {
          opacity: 0;
          transform: translateY(20px) rotateX(5deg);
        }
        to {
          opacity: 1;
          transform: translateY(0) rotateX(0);
        }
      }

      .card-content {
        padding: 2rem;
      }

      /* Section du logo */
      .logo-section {
        text-align: center;
        margin-bottom: 2rem;
      }

      .logo-container {
        width: 80px;
        height: 80px;
        margin: 0 auto 1rem;
        background: linear-gradient(135deg, #e74c3c 0%, #1e3c72 100%);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: logoFloat 6s ease-in-out infinite;
        box-shadow: 0 10px 20px rgba(231, 76, 60, 0.2);
      }

      @keyframes logoFloat {
        0%,
        100% {
          transform: translateY(0) scale(1);
          box-shadow: 0 10px 20px rgba(231, 76, 60, 0.2);
        }
        50% {
          transform: translateY(-10px) scale(1.05);
          box-shadow: 0 15px 30px rgba(231, 76, 60, 0.3);
        }
      }

      .logo-icon {
        color: white;
        font-size: 2.5rem;
        width: 2.5rem;
        height: 2.5rem;
      }

      .title {
        color: #1e3c72;
        font-weight: 700;
        font-size: 1.75rem;
        margin-bottom: 0.5rem;
      }

      .subtitle {
        color: #666;
        font-size: 0.95rem;
      }

      /* Formulaire */
      .login-form {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }

      .form-field {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      label {
        color: #1e3c72;
        font-size: 0.9rem;
        font-weight: 500;
      }

      .input-container {
        position: relative;
      }

      .form-input {
        width: 100%;
        padding: 0.75rem 1rem;
        padding-right: 2.5rem;
        border: 2px solid #e8eaf6;
        border-radius: 12px;
        font-size: 1rem;
        color: #1e3c72;
        transition: all 0.3s ease;
        background: white;
      }

      .form-input:focus {
        border-color: #1e3c72;
        box-shadow: 0 0 0 3px rgba(30, 60, 114, 0.1);
        transform: translateY(-1px);
      }

      .field-icon,
      .password-toggle {
        position: absolute;
        right: 0.75rem;
        top: 50%;
        transform: translateY(-50%);
        color: #1e3c72;
        transition: all 0.3s ease;
      }

      .password-toggle {
        background: none;
        border: none;
        cursor: pointer;
      }

      .password-toggle:hover {
        color: #e74c3c;
      }

      /* Bouton de soumission */
      .submit-button {
        padding: 0.75rem;
        background: linear-gradient(135deg, #1e3c72 0%, #e74c3c 100%);
        color: white;
        border: none;
        border-radius: 12px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 0.5rem;
      }

      .submit-button:not(:disabled):hover {
        background: linear-gradient(135deg, #2a4d8f 0%, #f05b4c 100%);
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(231, 76, 60, 0.3);
      }

      .submit-button:disabled {
        opacity: 0.7;
        cursor: not-allowed;
      }

      /* Message d'erreur */
      .error-text {
        color: #e74c3c;
        font-size: 0.8rem;
        margin-top: 0.25rem;
        animation: errorShake 0.5s ease;
      }

      .error-message {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.75rem;
        background: #fff5f5;
        border-left: 4px solid #e74c3c;
        border-radius: 8px;
        color: #e74c3c;
        font-size: 0.9rem;
        animation: errorSlide 0.3s ease;
      }

      @keyframes errorShake {
        0%,
        100% {
          transform: translateX(0);
        }
        25% {
          transform: translateX(-5px);
        }
        75% {
          transform: translateX(5px);
        }
      }

      @keyframes errorSlide {
        from {
          opacity: 0;
          transform: translateY(-10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      /* Responsive design */
      @media (max-width: 480px) {
        .card-content {
          padding: 1.5rem;
        }

        .login-card {
          margin: 1rem;
        }

        .logo-container {
          width: 60px;
          height: 60px;
        }

        .title {
          font-size: 1.5rem;
        }
      }

      /* Hover effects */
      .input-container:hover .field-icon {
        color: #e74c3c;
      }

      .form-input:hover {
        border-color: #1e3c72;
      }

      /* Spinner personnalisé */
      mat-spinner ::ng-deep circle {
        stroke: #ffffff !important;
      }
    `,
  ],
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';
  isLoading: boolean = false;
  hidePassword: boolean = true;

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required, Validators.minLength(8)],
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const { email, password } = this.loginForm.value;

      this.authService.login(email, password).subscribe({
        next: (response: any) => {
          this.isLoading = false;
          // Rediriger vers la page d'accueil ou le tableau de bord
          const arry = [
            {
              role: response.role,
              token: response.token,
            },
          ];
          console.log(arry);
        },
        error: (error) => {
          this.isLoading = false;
          if (error.status === 401) {
            this.errorMessage = 'Email ou mot de passe incorrect';
          } else {
            this.errorMessage =
              error.error?.message ||
              'Une erreur est survenue lors de la connexion';
          }

          // Animation de secousse pour le formulaire en cas d'erreur
          const formElement = document.querySelector('mat-card');
          if (formElement) {
            formElement.classList.add('shake-animation');
            setTimeout(() => {
              formElement.classList.remove('shake-animation');
            }, 500);
          }
        },
      });
    } else {
      // Marquer tous les champs comme touchés pour afficher les erreurs de validation
      Object.keys(this.loginForm.controls).forEach((key) => {
        const control = this.loginForm.get(key);
        control?.markAsTouched();
      });
    }
  }
}
