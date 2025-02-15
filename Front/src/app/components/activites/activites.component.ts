import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  ChangeDetectorRef,
  ElementRef,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Activite } from '../../models/activite.model';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as ActiviteActions from '../../store/activite/activite.actions';
import * as ActiviteSelectors from '../../store/activite/activite.selectors';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { ActiviteState } from '../../store/activite/activite.reducer';

@Component({
  selector: 'app-activites',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
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
              <mat-icon class="transform rotate-12">event_note</mat-icon>
              GESTION DES ACTIVITÉS
            </h1>
          </div>
        </div>
        <p class="ml-4 text-lg font-medium tracking-wider text-white uppercase">
          Organisez et suivez les activités des orphelins
        </p>
      </div>

      <!-- Barre d'actions -->
      <div
        class="flex flex-col gap-4 justify-between items-stretch mb-8 md:flex-row md:items-center"
      >
        <div class="relative w-full md:w-1/3">
          <mat-form-field class="w-full rounded-xl backdrop-blur-md">
            <mat-label class="text-white uppercase"
              >Rechercher une activité</mat-label
            >
            <input
              matInput
              [(ngModel)]="searchTerm"
              (keyup)="applyFilter($event)"
              placeholder="Nom, description, date..."
              #input
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
      </div>

      <!-- Cards Grid -->
      <div
        class="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-3"
        role="region"
        aria-label="Liste des activités"
      >
        <!-- Bouton Ajouter -->
        <div class="flex col-span-full justify-end mb-4">
          <button
            mat-raised-button
            color="primary"
            (click)="addActivite()"
            *ngIf="userRole === 'ADMIN' || userRole === 'GESTIONNAIRE'"
            class="bg-blue-600 hover:bg-blue-700"
          >
            <mat-icon>add</mat-icon>
            Nouvelle Activité
          </button>
        </div>

        @if (loading$ | async) {
        <div
          class="flex flex-col col-span-full gap-4 justify-center items-center p-8"
        >
          <mat-spinner diameter="60"></mat-spinner>
          <p class="text-xl font-semibold text-white animate-pulse">
            Chargement des activités en cours...
          </p>
          <p class="text-sm text-white opacity-75">
            Veuillez patienter quelques secondes
          </p>
        </div>
        } @else { @for (activite of filteredActivites$ | async; track
        activite.id) {
        <mat-card
          class="bg-white rounded-xl border border-gray-100 shadow-lg transition-all duration-300 transform hover:shadow-xl hover:-translate-y-1"
        >
          <mat-card-header
            class="p-5 bg-gradient-to-r from-red-50 to-blue-50 rounded-t-xl border-b border-gray-100"
          >
            <div class="flex justify-between items-start mb-4 w-full">
              <div>
                <mat-card-title
                  class="mb-2 text-xl font-bold text-gray-800 uppercase"
                >
                  {{ activite.nom }}
                </mat-card-title>
                <mat-card-title
                  class="flex gap-2 items-center font-medium text-gray-700"
                >
                  <mat-icon class="text-red-500">calendar_today</mat-icon>
                  {{ activite.date | date : 'dd MMMM yyyy' | uppercase }}
                </mat-card-title>
              </div>
              <div
                class="flex gap-2 items-center px-4 py-2 bg-gradient-to-r from-red-100 to-blue-100 rounded-xl shadow-sm"
              >
                <mat-icon class="text-red-500">payments</mat-icon>
                <span class="text-lg font-bold text-gray-800"
                  >{{ activite.budget }} DH</span
                >
              </div>
            </div>
          </mat-card-header>

          <mat-card-content class="p-5 mt-4">
            <h4 class="text-lg font-extrabold text-red-500 uppercase">
              Description :

              <span class="text-gray-700 lowercase">
                {{ activite.description }}</span
              >
            </h4>
            <!-- Statistiques -->
            <div
              class="flex justify-between items-center p-4 mb-6 bg-gradient-to-r from-red-50 to-blue-50 rounded-xl"
            >
              <div class="flex gap-3 items-center">
                <div
                  class="p-3 bg-gradient-to-r from-red-100 to-blue-100 rounded-xl shadow-sm"
                >
                  <mat-icon class="text-red-500">people</mat-icon>
                </div>
                <div class="flex flex-col">
                  <span
                    class="font-medium tracking-wider text-gray-600 uppercase"
                    >Participants</span
                  >
                  <span class="text-2xl font-bold text-gray-800">{{
                    activite.participants.length
                  }}</span>
                </div>
              </div>
            </div>

            <!-- Liste complète des participants -->
            <div class="space-y-3">
              <h4
                class="flex gap-2 items-center mb-3 font-medium tracking-wider text-gray-700 uppercase"
              >
                <mat-icon class="text-blue-500">groups</mat-icon>
                Tous les Participants
              </h4>
              <div class="grid grid-cols-2 gap-2">
                @for (participant of activite.participants; track
                participant.id) {
                <div
                  class="flex gap-2 items-center px-3 py-2 bg-gradient-to-r from-red-50 to-blue-50 rounded-xl"
                >
                  <div
                    [class]="
                      'w-8 h-8 rounded-full flex items-center justify-center ' +
                      getParticipantBgColor(participant.id)
                    "
                  >
                    <mat-icon class="text-sm text-white">person</mat-icon>
                  </div>
                  <span class="text-sm font-medium text-gray-700 truncate">
                    {{ participant.nom | uppercase }}
                  </span>
                </div>
                }
              </div>
            </div>
          </mat-card-content>

          <mat-card-actions
            class="flex gap-2 justify-end p-4 bg-gradient-to-r from-red-50 to-blue-50 rounded-b-xl border-t border-gray-100"
          >
            <ng-container
              *ngIf="userRole === 'ADMIN' || userRole === 'GESTIONNAIRE'"
            >
              <button
                mat-icon-button
                (click)="editActivite(activite)"
                [attr.aria-label]="'Modifier ' + activite.nom"
                class="text-purple-500 transition-colors hover:bg-purple-100"
              >
                <mat-icon>edit</mat-icon>
              </button>
              <button
                mat-icon-button
                (click)="deleteActivite(activite)"
                [attr.aria-label]="'Supprimer ' + activite.nom"
                class="text-red-500 transition-colors hover:bg-red-100"
              >
                <mat-icon>delete</mat-icon>
              </button>
            </ng-container>
          </mat-card-actions>
        </mat-card>
        } } @if (!(filteredActivites$ | async)?.length && !(loading$ | async)) {
        <div class="col-span-full text-center text-white">
          Aucune activité trouvée
        </div>
        }
      </div>

      <!-- Pagination -->
      <mat-paginator
        [length]="totalElements$ | async"
        [pageSize]="pageSize$ | async"
        [pageIndex]="currentPage$ | async"
        [pageSizeOptions]="[6, 12, 24, 50]"
        (page)="onPageChange($event)"
        showFirstLastButtons
        class="bg-white rounded-lg shadow-sm"
        aria-label="Sélectionner la page"
      >
      </mat-paginator>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      mat-card {
        height: 100%;
        display: flex;
        flex-direction: column;
      }

      mat-card-content {
        flex-grow: 1;
      }

      .animate-fadeIn {
        animation: fadeIn 0.5s ease-out;
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(-10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      ::ng-deep .mat-mdc-card {
        --mdc-elevated-card-container-color: white;
      }

      ::ng-deep .mat-mdc-paginator {
        background: white;
      }

      ::ng-deep .mat-mdc-paginator-container {
        padding: 8px 16px;
      }

      ::ng-deep .mat-mdc-paginator-range-label,
      ::ng-deep .mat-mdc-paginator-page-size-label {
        color: #666;
      }

      ::ng-deep .mat-mdc-paginator-navigation-previous,
      ::ng-deep .mat-mdc-paginator-navigation-next,
      ::ng-deep .mat-mdc-paginator-navigation-first,
      ::ng-deep .mat-mdc-paginator-navigation-last {
        color: #666;
      }

      ::ng-deep .mat-mdc-paginator-navigation-previous:hover,
      ::ng-deep .mat-mdc-paginator-navigation-next:hover,
      ::ng-deep .mat-mdc-paginator-navigation-first:hover,
      ::ng-deep .mat-mdc-paginator-navigation-last:hover {
        background-color: #f5f5f5;
      }

      ::ng-deep .mat-mdc-select-value {
        color: #666;
      }

      ::ng-deep .mat-mdc-form-field-subscript-wrapper {
        display: none;
      }

      ::ng-deep .mat-mdc-text-field-wrapper {
        background-color: white;
      }

      ::ng-deep .mat-mdc-paginator-page-size-select {
        margin: 0 8px;
      }
    `,
  ],
})
export class ActivitesComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = [
    'nom',
    'description',
    'date',
    'budget',
    'participants',
    'actions',
  ];
  dataSource: MatTableDataSource<Activite>;
  canEdit: boolean = false;
  searchTerm: string = '';
  activites$ = this.store.select(ActiviteSelectors.selectAllActivites);
  loading$ = this.store.select(ActiviteSelectors.selectActivitesLoading);
  error$ = this.store.select(ActiviteSelectors.selectActivitesError);
  searchSubject = new Subject<string>();
  destroy$ = new Subject<void>();
  userRole: string = '';
  pageSize$ = this.store.select((state) => state.activite.pageSize);
  currentPage$ = this.store.select((state) => state.activite.currentPage);
  totalElements$ = this.store.select((state) => state.activite.totalElements);
  filteredActivites$ = this.store.select(
    ActiviteSelectors.selectFilteredActivites
  );

  constructor(
    private store: Store<{ activite: ActiviteState }>,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.dataSource = new MatTableDataSource<Activite>([]);
  }

  ngOnInit(): void {
    this.userRole = this.authService.getUserRole() || '';
    this.loadActivitesPage();
    this.route.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => {
        const searchTerm = params['activite'] || '';
        this.searchSubject.next(searchTerm);
      });
  }

  loadActivitesPage(): void {
    this.store.dispatch(
      ActiviteActions.loadActivitesPage({
        page: 0,
        pageSize: 6,
      })
    );
  }

  onPageChange(event: any): void {
    this.store.dispatch(
      ActiviteActions.loadActivitesPage({
        page: event.pageIndex,
        pageSize: event.pageSize,
      })
    );
  }

  addActivite(): void {
    this.router.navigate(['/activite/new']);
  }

  editActivite(activite: Activite): void {
    this.router.navigate(['/activites/edit', activite.id]);
  }

  deleteActivite(activite: Activite): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette activité ?')) {
      this.store.dispatch(ActiviteActions.deleteActivite({ id: activite.id! }));
    }
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

  getParticipantBgColor(participantId: number | undefined): string {
    const colors = [
      'bg-gradient-to-r from-red-500 to-red-600',
      'bg-gradient-to-r from-blue-500 to-blue-600',
      'bg-gradient-to-r from-purple-500 to-purple-600',
    ];
    const id = participantId ?? 0;
    return colors[id % colors.length];
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.searchTerm = filterValue.trim().toLowerCase();
    this.store.dispatch(
      ActiviteActions.setSearchTerm({ searchTerm: this.searchTerm })
    );
  }

  resetSearch(): void {
    this.searchTerm = '';
    this.store.dispatch(ActiviteActions.setSearchTerm({ searchTerm: '' }));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
