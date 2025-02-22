import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import * as OrphelinActions from '../../../store/orphelin/orphelin.actions';
import * as OrphelinSelectors from '../../../store/orphelin/orphelin.selectors';
import { Orphelin } from '../../../models/orphelin.model';
import { OrphelinState } from '../../../store/orphelin/orphelin.reducer';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-orphelins-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  template: `
    <div
      class="p-4 min-h-screen bg-gradient-to-br from-red-600 via-purple-600 to-blue-600 md:p-6 lg:p-8"
    >
      <!-- En-tête avec animation -->
      <div class="mb-8 animate-fadeIn">
        <div
          class="inline-block p-2 mb-4 rounded-2xl shadow-lg backdrop-blur-md bg-white/90"
        >
          <div
            class="px-6 py-3 bg-gradient-to-r from-red-500 to-blue-500 rounded-xl"
          >
            <h1
              class="flex gap-3 items-center text-3xl font-bold tracking-wider text-white uppercase"
            >
              <mat-icon class="transform rotate-12">child_care</mat-icon>
              GESTION DES ORPHELINS
            </h1>
          </div>
        </div>
        <p class="ml-4 text-lg font-medium tracking-wider text-white uppercase">
          Gérez et suivez les informations des orphelins
        </p>
      </div>

      <!-- Barre d'actions -->
      <div
        class="flex flex-col gap-4 justify-between items-stretch mb-8 md:flex-row md:items-center"
      >
        <div class="relative w-full md:w-1/3">
          <mat-form-field class="w-full rounded-xl backdrop-blur-md">
            <mat-label class="text-white uppercase"
              >Rechercher un orphelin</mat-label
            >
            <input
              matInput
              placeholder="Nom, état de santé..."
              class="py-1 text-white"
            />
            <mat-icon matSuffix class="text-red-500">search</mat-icon>
          </mat-form-field>
        </div>
        @if (isAdmin || isGestionnaire) {
        <button
          mat-raised-button
          color="primary"
          (click)="addOrphelin()"
          class="bg-blue-600 hover:bg-blue-700"
        >
          <mat-icon>add</mat-icon>
          Nouvel Orphelin
        </button>
        }
      </div>

      <!-- Cards Grid -->
      <div
        class="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-3"
        role="region"
        aria-label="Liste des orphelins"
      >
        <!-- Loading State -->
        @if (loading$ | async) {
        <div
          class="flex flex-col col-span-full gap-4 justify-center items-center p-8 rounded-xl backdrop-blur-md bg-white/10"
        >
          <div
            class="w-16 h-16 rounded-full border-4 border-t-transparent border-indigo-500 animate-spin"
          ></div>
          <p class="text-xl font-semibold text-white animate-pulse">
            Chargement des orphelins...
          </p>
          <p class="text-sm text-white/75">
            Veuillez patienter pendant le chargement des données
          </p>
        </div>
        } @else { @for (orphelin of (mainOrphelins$ | async)?.items; track
        orphelin.id) {
        <mat-card
          class="relative overflow-hidden bg-white/95 backdrop-blur-lg rounded-2xl shadow-xl transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 border border-white/20"
        >
          <!-- Gradient Overlay -->
          <div
            class="absolute inset-0 bg-gradient-to-br from-red-500/5 to-blue-500/5 pointer-events-none"
          ></div>

          <!-- Header -->
          <div class="relative p-6 bg-gradient-to-r from-red-500 to-blue-500">
            <div class="absolute inset-0 bg-black/10"></div>
            <div class="relative z-10">
              <h3 class="text-2xl font-bold text-white mb-2">
                {{ orphelin.nom | uppercase }}
              </h3>
              <div class="flex items-center text-white/90 gap-2">
                <mat-icon class="text-sm">person</mat-icon>
                <span>{{ orphelin.genre | uppercase }}</span>
              </div>
            </div>
          </div>

          <!-- Content -->
          <div class="p-6 space-y-6">
            <!-- Âge -->
            <div class="transform transition-all duration-300 hover:scale-105">
              <div
                class="flex items-center p-4 rounded-xl bg-gradient-to-r from-red-50 to-blue-50 group-hover:from-red-100 group-hover:to-blue-100"
              >
                <mat-icon class="text-red-500 mr-4">cake</mat-icon>
                <div>
                  <div class="text-sm font-medium text-gray-500">Âge</div>
                  <div class="text-lg font-bold text-gray-900">
                    {{ orphelin.age }} ans
                  </div>
                </div>
              </div>
            </div>

            <!-- État de santé -->
            <div class="transform transition-all duration-300 hover:scale-105">
              <div
                class="flex items-center p-4 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 group-hover:from-purple-100 group-hover:to-pink-100"
              >
                <mat-icon class="text-purple-500 mr-4">favorite</mat-icon>
                <div>
                  <div class="text-sm font-medium text-gray-500">
                    État de santé
                  </div>
                  <div class="text-lg font-bold text-gray-900">
                    {{ orphelin.etatDeSante | uppercase }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Niveau d'éducation -->
            <div class="transform transition-all duration-300 hover:scale-105">
              <div
                class="flex items-center p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 group-hover:from-blue-100 group-hover:to-indigo-100"
              >
                <mat-icon class="text-blue-500 mr-4">school</mat-icon>
                <div>
                  <div class="text-sm font-medium text-gray-500">
                    Niveau d'éducation
                  </div>
                  <div class="text-lg font-bold text-gray-900">
                    {{ orphelin.niveauEducation }}
                  </div>
                </div>
              </div>
            </div>
            <!--  relation avec le parent -->
            <div class="transform transition-all duration-300 hover:scale-105">
              <div
                class="flex items-center p-4 rounded-xl bg-gradient-to-r from-green-50 to-lime-50 group-hover:from-green-100 group-hover:to-lime-100"
              >
                <mat-icon class="text-green-500 mr-4">child_care</mat-icon>
                <div>
                  <div class="text-sm font-medium text-gray-500">
                    Relation avec le tuteur
                  </div>
                  <div class="text-lg font-bold text-gray-900">
                    {{ orphelin.relation }} - {{ orphelin.nomTuteur }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Actions -->
          @if (isAdmin || isGestionnaire) {
          <div
            class="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200"
          >
            <div class="flex justify-end gap-3">
              <button
                mat-icon-button
                (click)="editOrphelin(orphelin)"
                class="text-blue-500 hover:bg-blue-50 transition-all duration-300"
                matTooltip="Modifier"
              >
                <mat-icon>edit</mat-icon>
              </button>
              <button
                mat-icon-button
                (click)="deleteOrphelin(orphelin)"
                class="text-red-500 hover:bg-red-50 transition-all duration-300"
                matTooltip="Supprimer"
              >
                <mat-icon>delete</mat-icon>
              </button>
            </div>
          </div>
          }
        </mat-card>
        } @if (!(mainOrphelins$ | async)?.items?.length) {
        <div class="col-span-full">
          <div
            class="text-center py-16 bg-white/10 backdrop-blur-md rounded-3xl"
          >
            <mat-icon class="text-white/50 text-6xl mb-4">search_off</mat-icon>
            <h3 class="text-2xl font-semibold text-white mb-2">
              Aucun orphelin trouvé
            </h3>
            <p class="text-white/70">
              Ajoutez des orphelins pour les voir apparaître ici
            </p>
          </div>
        </div>
        } }
      </div>

      <!-- Pagination -->
      <mat-paginator
        [length]="(mainOrphelins$ | async)?.totalElements || 0"
        [pageSize]="(mainOrphelins$ | async)?.pageSize || 6"
        [pageIndex]="(mainOrphelins$ | async)?.currentPage || 0"
        [pageSizeOptions]="[6, 12, 24, 50]"
        (page)="onPageChange($event)"
        showFirstLastButtons
        class="bg-white/95 backdrop-blur-lg rounded-2xl shadow-lg"
      >
      </mat-paginator>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .animate-fadeIn {
        animation: fadeIn 0.5s ease-out;
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(-20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      ::ng-deep {
        .mat-mdc-card {
          --mdc-elevated-card-container-color: transparent;
        }

        .mat-mdc-paginator {
          background: transparent;
        }

        .mat-mdc-paginator-container {
          color: #1f2937;
        }

        .mat-mdc-paginator-range-label,
        .mat-mdc-paginator-page-size-label {
          color: #4b5563;
        }

        .mat-mdc-paginator-navigation-previous,
        .mat-mdc-paginator-navigation-next,
        .mat-mdc-paginator-navigation-first,
        .mat-mdc-paginator-navigation-last {
          color: #4b5563;
        }

        .mat-mdc-paginator-navigation-previous:hover,
        .mat-mdc-paginator-navigation-next:hover,
        .mat-mdc-paginator-navigation-first:hover,
        .mat-mdc-paginator-navigation-last:hover {
          background-color: rgba(0, 0, 0, 0.04);
        }

        .mat-mdc-select-value {
          color: #4b5563;
        }

        .mat-mdc-form-field {
          .mat-mdc-text-field-wrapper {
            background-color: rgba(255, 255, 255, 0.1);
          }

          .mat-mdc-form-field-flex {
            padding: 0 12px;
          }

          input.mat-mdc-input-element {
            color: white;
            &::placeholder {
              color: rgba(255, 255, 255, 0.7);
            }
          }

          .mdc-floating-label {
            color: white;
          }

          .mat-mdc-form-field-icon-suffix {
            color: white;
          }
        }

        .mat-mdc-tooltip {
          background-color: rgba(0, 0, 0, 0.9);
          backdrop-filter: blur(4px);
          border-radius: 8px;
          padding: 8px 12px;
        }
      }
    `,
  ],
})
export class OrphelinsListComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  mainOrphelins$ = this.store
    .select(OrphelinSelectors.selectMainOrphelins)
    .pipe(
      takeUntil(this.destroy$),
    );
  loading$ = this.store.select(OrphelinSelectors.selectOrphelinLoading);
  error$ = this.store.select(OrphelinSelectors.selectOrphelinError);

  isAdmin: boolean = false;
  isGestionnaire: boolean = false;

  constructor(
    private store: Store<{ orphelin: OrphelinState }>,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.isAdmin = this.authService.getUserRole() === 'ADMIN';
    this.isGestionnaire = this.authService.getUserRole() === 'GESTIONNAIRE';
  }

  ngOnInit(): void {
    this.loadOrphelinsPage(0, 6);
  }

  loadOrphelinsPage(page: number, size: number): void {
    this.store.dispatch(OrphelinActions.loadOrphelinsPaginated({ page, size }));
  }

  onPageChange(event: PageEvent): void {
    this.loadOrphelinsPage(event.pageIndex, event.pageSize);
  }

  addOrphelin(): void {
    this.router.navigate(['/orphelins/new']);
  }

  editOrphelin(orphelin: Orphelin): void {
    this.router.navigate(['/orphelins/edit', orphelin.id]);
  }

  deleteOrphelin(orphelin: Orphelin): void {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: `Voulez-vous vraiment supprimer l'orphelin ${orphelin.nom} ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler',
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#4f46e5',
      background: 'rgba(255, 255, 255, 0.9)',
      backdrop: 'rgba(0, 0, 0, 0.4)',
      customClass: {
        title: 'text-xl font-bold text-gray-800',
        htmlContainer: 'text-gray-600',
        confirmButton: 'px-4 py-2 rounded-lg',
        cancelButton: 'px-4 py-2 rounded-lg',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        this.store.dispatch(
          OrphelinActions.deleteOrphelin({ id: orphelin.id! })
        );
        this.showNotification('Orphelin supprimé avec succès', 'success');
      }
    });
  }

  private showNotification(message: string, type: 'success' | 'error'): void {
    this.snackBar.open(message, 'Fermer', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass:
        type === 'success'
          ? ['bg-green-500', 'text-white']
          : ['bg-red-500', 'text-white'],
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
