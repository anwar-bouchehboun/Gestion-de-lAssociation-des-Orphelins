import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="dashboard-layout">
      <!-- Main Content -->
      <div
        class="bg-gradient-to-br from-red-200 via-white to-blue-600 main-content"
      >
        <!-- Dashboard Content -->
        <main class="p-6 dashboard-content">
          <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <!-- Carte de Bienvenue -->
            <mat-card
              class="col-span-full text-white bg-gradient-to-r from-red-600 via-purple-600 to-blue-600 welcome-card"
            >
              <mat-card-header>
                <div class="p-6 w-full">
                  <h2 class="mb-2 text-2xl font-bold">
                    Bienvenue {{ username }}
                  </h2>
                  <p class="text-white/90">{{ userRole }}</p>
                  <p class="mt-4 text-white/80">
                    Vous êtes connecté au tableau de bord de gestion des
                    orphelins.
                  </p>
                </div>
              </mat-card-header>
            </mat-card>

            <!-- Cartes Statistiques -->
            <mat-card
              class="bg-white transition-all duration-300 stat-card hover:shadow-xl"
            >
              <div class="overflow-hidden relative p-6">
                <div class="relative z-10">
                  <div class="flex justify-between items-start">
                    <div>
                      <p class="text-sm font-medium text-white">
                        Total Orphelins
                      </p>
                      <p class="mt-2 text-3xl font-bold text-white">150</p>
                    </div>
                    <div
                      class="flex justify-center items-center w-12 h-12 bg-red-100 rounded-full"
                    >
                      <mat-icon class="text-red-600">people</mat-icon>
                    </div>
                  </div>
                </div>
                <div
                  class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br to-transparent transform rotate-45 from-red-500/10"
                ></div>
              </div>
            </mat-card>

            <mat-card
              class="bg-white transition-all duration-300 stat-card hover:shadow-xl"
            >
              <div class="overflow-hidden relative p-6">
                <div class="relative z-10">
                  <div class="flex justify-between items-start">
                    <div>
                      <p class="text-sm font-medium text-white">Dons ce mois</p>
                      <p class="mt-2 text-3xl font-bold text-white">25</p>
                    </div>
                    <div
                      class="flex justify-center items-center w-12 h-12 bg-blue-100 rounded-full"
                    >
                      <mat-icon class="text-blue-600"
                        >volunteer_activism</mat-icon
                      >
                    </div>
                  </div>
                </div>
                <div
                  class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br to-transparent transform rotate-45 from-blue-500/10"
                ></div>
              </div>
            </mat-card>

            <mat-card
              class="bg-white transition-all duration-300 stat-card hover:shadow-xl"
            >
              <div class="overflow-hidden relative p-6">
                <div class="relative z-10">
                  <div class="flex justify-between items-start">
                    <div>
                      <p class="text-sm font-medium text-white">
                        Activités en cours
                      </p>
                      <p class="mt-2 text-3xl font-bold text-white">8</p>
                    </div>
                    <div
                      class="flex justify-center items-center w-12 h-12 bg-red-100 rounded-full"
                    >
                      <mat-icon class="text-red-600">event</mat-icon>
                    </div>
                  </div>
                </div>
                <div
                  class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br to-transparent transform rotate-45 from-red-500/10"
                ></div>
              </div>
            </mat-card>


          </div>
        </main>
      </div>
    </div>
  `,
  styles: [
    `
      .dashboard-layout {
        display: flex;
        height: 100vh;
        overflow: hidden;
      }

      .sidebar {
        width: 280px;
        flex-shrink: 0;
        z-index: 30;
      }

      .main-content {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }

      .header {
        flex-shrink: 0;
      }

      .dashboard-content {
        flex-grow: 1;
        overflow-y: auto;
      }

      .welcome-card {
        border-radius: 1rem;
        overflow: hidden;
        transition: all 0.3s ease;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      }

      .welcome-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
      }

      .stat-card {
        border-radius: 1rem;
        overflow: hidden;
        transition: all 0.3s ease;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        position: relative;
      }

      .stat-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
      }

      .stat-card::after {
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(
          135deg,
          transparent 0%,
          rgba(255, 255, 255, 0.1) 100%
        );
      }

      @media (max-width: 768px) {
        .sidebar {
          position: fixed;
          height: 100vh;
          transform: translateX(-100%);
          transition: transform 0.3s ease-in-out;
        }

        .sidebar.open {
          transform: translateX(0);
        }

        .main-content {
          margin-left: 0;
        }
      }
    `,
  ],
})
export class DashboardComponent implements OnInit {
  username: string | null;
  userRole: string | null;
  isSidebarOpen: boolean = false;

  constructor(private authService: AuthService, private router: Router) {
    this.username = this.authService.getUserName();
    this.userRole = this.authService.getUserRole();

  }

  ngOnInit(): void {
    if (!this.userRole || !this.username) {
      this.userRole = this.authService.getUserRole() || '';
      this.username=this.authService.getUserName()|| '';
    }
    // Vérifier si l'utilisateur est connecté et a un rôle

  }
}
