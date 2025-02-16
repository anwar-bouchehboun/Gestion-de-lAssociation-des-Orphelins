import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatNativeDateModule } from '@angular/material/core';
import { Activite } from '../../models/activite.model';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import * as ActiviteActions from '../../store/activite/activite.actions';
import * as ActiviteSelectors from '../../store/activite/activite.selectors';
import * as OrphelinActions from '../../store/orphelin/orphelin.actions';
import * as OrphelinSelectors from '../../store/orphelin/orphelin.selectors';
import { takeUntil, map } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { Orphelin } from '../../models/orphelin.model';

@Component({
  selector: 'app-activite-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatSelectModule,
    MatNativeDateModule,
  ],
  template: `
    <div
      class="px-4 py-12 min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-violet-600 sm:px-6 lg:px-8"
    >
      <!-- Loading Overlay -->
      <div
        *ngIf="loading$ | async"
        class="flex fixed inset-0 z-50 justify-center items-center backdrop-blur-sm bg-black/50"
      >
        <div class="p-8 rounded-xl shadow-xl bg-white/90">
          <div class="flex flex-col items-center space-y-4">
            <div
              class="w-12 h-12 rounded-full border-4 border-indigo-500 animate-spin border-t-transparent"
            ></div>
            <p class="text-lg font-medium text-indigo-900">
              {{ isEditMode ? 'Modification' : 'Création' }} en cours...
            </p>
          </div>
        </div>
      </div>

      <div class="mx-auto max-w-3xl">
        <!-- Logo ou Icône -->
        <div class="mb-8 text-center">
          <div
            class="inline-flex justify-center items-center mb-4 w-20 h-20 bg-gradient-to-r from-indigo-200 to-violet-200 rounded-full shadow-lg"
          >
            <i class="text-4xl text-indigo-600 fas fa-calendar-plus"></i>
          </div>
          <h2 class="text-3xl font-bold text-indigo-50">
            {{ isEditMode ? 'Modifier' : 'Créer' }} une activité
          </h2>
          <p class="mt-2 text-indigo-200">
            Remplissez les informations pour
            {{ isEditMode ? 'modifier' : 'créer' }} une nouvelle activité
          </p>
        </div>

        <!-- Formulaire -->
        <div
          class="overflow-hidden bg-gradient-to-br rounded-2xl shadow-xl backdrop-blur-xl from-indigo-400/95 to-red-400/95"
        >
          <div class="p-8">
            <form
              [formGroup]="activiteForm"
              (ngSubmit)="onSubmit()"
              class="space-y-6"
            >
              <!-- Nom -->
              <div class="form-group">
                <mat-form-field class="w-full">
                  <mat-label>
                    <span class="flex items-center space-x-2">
                      <i class="text-indigo-600 fas fa-bookmark"></i>
                      <span>Nom de l'activité</span>
                    </span>
                  </mat-label>
                  <input
                    matInput
                    formControlName="nom"
                    required
                    class="input-field"
                    placeholder="Entrez le nom de l'activité"
                  />
                </mat-form-field>
              </div>

              <!-- Description -->
              <div class="form-group">
                <mat-form-field class="w-full">
                  <mat-label>
                    <span class="flex items-center space-x-2">
                      <i class="text-indigo-600 fas fa-align-left"></i>
                      <span>Description</span>
                    </span>
                  </mat-label>
                  <textarea
                    matInput
                    formControlName="description"
                    required
                    rows="4"
                    class="resize-none input-field"
                    placeholder="Décrivez l'activité en détail..."
                  ></textarea>
                </mat-form-field>
              </div>

              <!-- Date et Budget -->
              <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div class="form-group">
                  <mat-form-field class="w-full">
                    <mat-label>
                      <span class="flex items-center space-x-2">
                        <i class="text-indigo-600 fas fa-calendar"></i>
                        <span>Date</span>
                      </span>
                    </mat-label>
                    <input
                      matInput
                      [matDatepicker]="picker"
                      formControlName="date"
                      required
                      class="input-field"
                    />
                    <mat-datepicker-toggle
                      matSuffix
                      [for]="picker"
                      class="text-indigo-600"
                    ></mat-datepicker-toggle>
                    <mat-datepicker #picker></mat-datepicker>
                  </mat-form-field>
                </div>

                <div class="form-group">
                  <mat-form-field class="w-full">
                    <mat-label>
                      <span class="flex items-center space-x-2">
                        <i class="text-indigo-600 fas fa-coins"></i>
                        <span>Budget</span>
                      </span>
                    </mat-label>
                    <span matPrefix class="mr-2 ml-2 text-white"> €&nbsp;</span>
                    <input
                      matInput
                      type="number"
                      formControlName="budget"
                      required
                      class="input-field"
                      placeholder="0.00"
                    />
                  </mat-form-field>
                </div>
              </div>

              <!-- Participants -->
              <div class="form-group">
                <mat-form-field class="w-full">
                  <mat-label>
                    <span class="flex items-center space-x-2">
                      <i class="text-white fas fa-users"></i>
                      <span>Participants</span>
                    </span>
                  </mat-label>
                  <mat-select
                    formControlName="participantsid"
                    multiple
                    class="input-field"
                  >
                    <div
                      class="sticky top-0 z-10 p-3 bg-gradient-to-r from-indigo-50 to-violet-50 border-b border-indigo-200"
                    >
                      <div class="text-sm font-medium text-indigo-700">
                        Sélectionnez les participants
                      </div>
                    </div>
                    <ng-container *ngIf="orphelins$ | async as orphelins">
                      <mat-option
                        *ngFor="let orphelin of orphelins"
                        [value]="orphelin.id"
                        class="option-item"
                      >
                        <div class="flex items-center py-2">
                          <span
                            class="mr-3 w-2 h-2 bg-indigo-500 rounded-full"
                          ></span>
                          <span class="font-medium text-indigo-800">{{
                            orphelin.nom
                          }}</span>
                          <span class="ml-2 text-sm text-indigo-600"
                            >({{ orphelin.age }} ans)</span
                          >
                        </div>
                      </mat-option>
                    </ng-container>
                  </mat-select>
                </mat-form-field>
              </div>

              <!-- Boutons -->
              <div
                class="flex flex-col justify-end pt-6 space-y-3 border-t border-indigo-200 sm:flex-row sm:space-y-0 sm:space-x-4"
              >
                <button
                  type="button"
                  (click)="onCancel()"
                  class="flex justify-center items-center px-6 py-3 space-x-2 w-full text-indigo-700 bg-gradient-to-r from-indigo-200 to-violet-200 rounded-lg transition-all duration-200 sm:w-auto hover:from-indigo-300 hover:to-violet-300"
                >
                  <i class="fas fa-times"></i>
                  <span>Annuler</span>
                </button>
                <button
                  type="submit"
                  [disabled]="!activiteForm.valid"
                  class="flex justify-center items-center px-6 py-3 space-x-2 w-full text-indigo-50 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-lg shadow-lg transition-all duration-200 sm:w-auto hover:from-indigo-700 hover:to-violet-700 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl"
                >
                  <i class="fas fa-save"></i>
                  <span>{{ isEditMode ? 'Modifier' : 'Créer' }}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class ActiviteFormComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  activiteForm: FormGroup;
  isEditMode: boolean = false;
  activiteId: number | null = null;
  orphelins$: Observable<Orphelin[]>;
  loading$ = this.store.select(ActiviteSelectors.selectActivitesLoading);

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.activiteForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      date: ['', Validators.required],
      budget: ['', [Validators.required, Validators.min(0)]],
      participantsid: [[], Validators.required],
    });

    this.orphelins$ = this.store
      .select(OrphelinSelectors.selectAllOrphelins)
      .pipe(map((orphelins) => (Array.isArray(orphelins) ? orphelins : [])));
  }

  ngOnInit(): void {
    // Charger les orphelins
    this.store.dispatch(OrphelinActions.loadOrphelins());

    // Charger les activités
    this.store.dispatch(ActiviteActions.loadActivites());

    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.activiteId = Number(params['id']);
      this.isEditMode = !!this.activiteId;

      if (this.isEditMode && this.activiteId) {
        this.store
          .select(ActiviteSelectors.selectActiviteById(this.activiteId))
          .pipe(takeUntil(this.destroy$))
          .subscribe((activite) => {
            if (activite) {
              console.log('activite form', activite);
              // Extraire les IDs des participants
              const participantIds =
                activite.participants?.map((p) => p.id) || [];
              this.activiteForm.patchValue({
                ...activite,
                date: new Date(activite.date),
                participantsid: participantIds, // Utiliser les IDs extraits des participants
              });
            }
          });
      }
    });
  }

  onSubmit(): void {
    if (this.activiteForm.valid) {
      const formValue = this.activiteForm.value;
      console.log('formValue', formValue);
      const activite: Activite = {
        ...formValue,
        date: formValue.date.toISOString().split('T')[0],
        participantsIds: formValue.participantsid || [],
        participants: [],
      };

      if (this.isEditMode && this.activiteId) {
        this.store.dispatch(
          ActiviteActions.updateActivite({
            id: this.activiteId,
            activite,
          })
        );
      } else {
        console.log('create activite', activite);
        this.store.dispatch(ActiviteActions.createActivite({ activite }));
      }

      // Attendre 1.5 secondes avant de naviguer
      setTimeout(() => {
        this.router.navigate(['/activites']);
      }, 1500);
    }
  }

  onCancel(): void {
    this.router.navigate(['/activites']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
