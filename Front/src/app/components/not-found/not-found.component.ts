import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
  ],
  template: `
    <div
      class="flex justify-center items-center p-4 w-full min-h-screen bg-gradient-to-br from-primary-900 to-warn-700"
    >
      <mat-card
        class="w-full max-w-lg border shadow-2xl backdrop-blur-lg bg-white/10 border-white/20"
      >
        <div class="p-8 text-center">
          <!-- Animated 404 -->
          <div class="relative mb-8">
            <div class="text-9xl font-bold animate-pulse text-white/90">
              404
            </div>
            <div
              class="absolute -bottom-4 w-full h-4 bg-gradient-to-t to-transparent blur-sm from-white/20"
            ></div>
          </div>

          <!-- Content -->
          <div class="space-y-6">
            <h1 class="text-3xl font-bold text-white">Page Non Trouvée</h1>

            <p class="text-lg text-white/80">
              Désolé, la page que vous recherchez n'existe pas ou a été
              déplacée.
            </p>

            <!-- Action Buttons -->
            <div class="flex flex-col gap-4 justify-center mt-8 sm:flex-row">
              <button
                *ngIf="isLoggedIn()"
                mat-raised-button
                color="primary"
                routerLink="/dashboard"
                class="!px-6 !py-3 !text-lg !font-medium hover:!scale-105 transition-transform"
              >
                <mat-icon class="mr-2">home</mat-icon>
                Tableau de bord
              </button>

              <button
                *ngIf="!isLoggedIn()"
                mat-stroked-button
                routerLink="/login"
                class="!px-6 !py-3 !text-lg !font-medium !text-white !border-white hover:!bg-white/10 transition-colors"
              >
                <mat-icon class="mr-2">arrow_back</mat-icon>
                Connexion
              </button>
            </div>
          </div>

          <!-- Decorative Elements -->
          <div
            class="absolute top-0 left-0 w-32 h-32 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 bg-primary-500/20"
          ></div>
          <div
            class="absolute right-0 bottom-0 w-32 h-32 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 bg-warn-500/20"
          ></div>
        </div>
      </mat-card>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        height: 100vh;
      }

      /* Ajout d'animations personnalisées si nécessaire */
      @keyframes float {
        0%,
        100% {
          transform: translateY(0);
        }
        50% {
          transform: translateY(-10px);
        }
      }
    `,
  ],
})
export class NotFoundComponent {
  constructor(private authService: AuthService) {}

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
}
