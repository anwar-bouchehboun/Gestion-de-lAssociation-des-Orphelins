import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
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
import { takeUntil, tap, map, filter, take } from 'rxjs/operators';
import * as OrphelinActions from '../../store/orphelin/orphelin.actions';
import * as OrphelinSelectors from '../../store/orphelin/orphelin.selectors';
import { Orphelin } from '../../models/orphelin.model';
import { OrphelinState } from '../../store/orphelin/orphelin.reducer';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-orphelins-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
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
              [(ngModel)]="searchTerm"
              (keyup)="applyFilter($event)"
              placeholder="Nom, état de santé..."
              class="py-1 text-white"
            />
            <button
              *ngIf="searchTerm"
              matSuffix
              mat-icon-button
              aria-label="Effacer"
              (click)="resetSearch()"
              class="text-red-500"
            >
              <mat-icon>close</mat-icon>
            </button>
            <mat-icon *ngIf="!searchTerm" matSuffix class="text-red-500"
              >search</mat-icon
            >
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
            class="w-16 h-16 rounded-full border-4 border-indigo-500 animate-spin border-t-transparent"
          ></div>
          <p class="text-xl font-semibold text-white animate-pulse">
            Chargement des orphelins...
          </p>
          <p class="text-sm text-white/75">
            Veuillez patienter pendant le chargement des données
          </p>
        </div>
        } @else { @for (orphelin of filteredOrphelins$ | async; track
        orphelin.id) {
        <mat-card
          class="overflow-hidden relative rounded-2xl border shadow-xl backdrop-blur-lg transition-all duration-500 bg-white/95 hover:shadow-2xl hover:-translate-y-1 border-white/20"
        >
          <!-- Gradient Overlay -->
          <div
            class="absolute inset-0 bg-gradient-to-br pointer-events-none from-red-500/5 to-blue-500/5"
          ></div>

          <!-- Header -->
          <div class="relative p-6 bg-gradient-to-r from-red-500 to-blue-500">
            <div class="absolute inset-0 bg-black/10"></div>
            <div class="relative z-10">
              <h3 class="mb-2 text-2xl font-bold text-white">
                {{ orphelin.nom | uppercase }}
              </h3>
              <div class="flex gap-2 items-center text-white/90">
                <mat-icon class="text-sm">person</mat-icon>
                <span>{{ orphelin.genre | uppercase }}</span>
              </div>
            </div>
          </div>

          <!-- Content -->
          <div class="p-6 space-y-6">
            <!-- Âge -->
            <div class="transition-all duration-300 transform hover:scale-105">
              <div
                class="flex items-center p-4 bg-gradient-to-r from-red-50 to-blue-50 rounded-xl group-hover:from-red-100 group-hover:to-blue-100"
              >
                <mat-icon class="mr-4 text-red-500">cake</mat-icon>
                <div>
                  <div class="text-sm font-medium text-gray-500">Âge</div>
                  <div class="text-lg font-bold text-gray-900">
                    {{ orphelin.age }} ans
                  </div>
                </div>
              </div>
            </div>

            <!-- État de santé -->
            <div class="transition-all duration-300 transform hover:scale-105">
              <div
                class="flex items-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl group-hover:from-purple-100 group-hover:to-pink-100"
              >
                <mat-icon class="mr-4 text-purple-500">favorite</mat-icon>
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
            <div class="transition-all duration-300 transform hover:scale-105">
              <div
                class="flex items-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl group-hover:from-blue-100 group-hover:to-indigo-100"
              >
                <mat-icon class="mr-4 text-blue-500">school</mat-icon>
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
            <div class="transition-all duration-300 transform hover:scale-105">
              <div
                class="flex items-center p-4 bg-gradient-to-r from-green-50 to-lime-50 rounded-xl group-hover:from-green-100 group-hover:to-lime-100"
              >
                <mat-icon class="mr-4 text-green-500">child_care</mat-icon>
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
            <div class="flex gap-3 justify-end">
              <button
                mat-icon-button
                (click)="editOrphelin(orphelin)"
                class="text-blue-500 transition-all duration-300 hover:bg-blue-50"
                matTooltip="Modifier"
              >
                <mat-icon>edit</mat-icon>
              </button>
              <button
                mat-icon-button
                (click)="deleteOrphelin(orphelin)"
                class="text-red-500 transition-all duration-300 hover:bg-red-50"
                matTooltip="Supprimer"
              >
                <mat-icon>delete</mat-icon>
              </button>
            </div>
          </div>
          }
        </mat-card>
        } @if (!(filteredOrphelins$ | async)?.length) {
        <div class="col-span-full">
          <div
            class="py-16 text-center rounded-3xl backdrop-blur-md bg-white/10"
          >
            <mat-icon class="mb-4 text-6xl text-white/50">search_off</mat-icon>
            <h3 class="mb-2 text-2xl font-semibold text-white">
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
        [length]="totalElements$ | async"
        [pageSize]="pageSize$ | async"
        [pageIndex]="currentPage$ | async"
        [pageSizeOptions]="[6, 12, 24, 50]"
        (page)="onPageChange($event)"
        showFirstLastButtons
        class="rounded-2xl shadow-lg backdrop-blur-lg bg-white/95"
      >
      </mat-paginator>

      <!-- Loading Overlay -->
      <div
        *ngIf="deleteLoading"
        class="flex fixed inset-0 z-50 justify-center items-center bg-black bg-opacity-50"
      >
        <div class="p-8 text-center bg-white rounded-lg shadow-xl">
          <div
            class="mx-auto mb-4 w-16 h-16 rounded-full border-4 border-blue-500 animate-spin border-t-transparent"
          ></div>
          <p class="text-lg font-semibold text-gray-700">
            Suppression en cours...
          </p>
          <p class="text-sm text-gray-500">Veuillez patienter</p>
        </div>
      </div>
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
  searchTerm: string = '';
  deleteLoading: boolean = false;
  mainOrphelins$ = this.store
    .select(OrphelinSelectors.selectMainOrphelins)
    .pipe(takeUntil(this.destroy$));
  loading$ = this.store.select(OrphelinSelectors.selectOrphelinLoading);
  error$ = this.store.select(OrphelinSelectors.selectOrphelinError);
  pageSize$ = this.store.select(
    (state) => state.orphelin.mainOrphelins.pageSize
  );
  currentPage$ = this.store.select(
    (state) => state.orphelin.mainOrphelins.currentPage
  );
  totalElements$ = this.store.select(
    (state) => state.orphelin.mainOrphelins.totalElements
  );
  filteredOrphelins$ = this.store
    .select(OrphelinSelectors.selectFilteredOrphelins)
    .pipe(
      map((orphelins) => {
        if (!orphelins) return [];
        return [...orphelins];
      })
    );

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

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.searchTerm = filterValue.trim().toLowerCase();
    this.store.dispatch(
      OrphelinActions.setSearchTerm({ searchTerm: this.searchTerm })
    );
  }

  resetSearch(): void {
    this.searchTerm = '';
    this.store.dispatch(OrphelinActions.setSearchTerm({ searchTerm: '' }));
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
      allowOutsideClick: false,
      showLoaderOnConfirm: true,
      preConfirm: () => {
        return new Promise((resolve) => {
          this.deleteLoading = true;
          this.store.dispatch(
            OrphelinActions.deleteOrphelin({ id: orphelin.id! })
          );

          // Attendre que la suppression soit terminée
          const subscription = this.store
            .select(OrphelinSelectors.selectOrphelinLoading)
            .pipe(
              takeUntil(this.destroy$),
              filter((loading) => !loading),
              take(1)
            )
            .subscribe(() => {
              this.deleteLoading = false;
              this.loadOrphelinsPage(0, 6);
              resolve(true);
              subscription.unsubscribe();
            });
        });
      },
    }).then((result) => {
      if (result.isConfirmed) {
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
