import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import * as OrphelinActions from '../../store/orphelin/orphelin.actions';
import * as OrphelinSelectors from '../../store/orphelin/orphelin.selectors';
import { OrphelinState } from '../../store/orphelin/orphelin.reducer';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Observable } from 'rxjs';
import { Tuteur } from '../../models/tuteur.model';
import { TuteurState } from '../../store/tuteur/tuteur.reducer';
import { selectAllTuteurs } from '../../store/tuteur/tuteur.selectors';
import * as TuteurActions from '../../store/tuteur/tuteur.actions';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-orphelin-form',
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
    MatIconModule,
    MatSnackBarModule,
  ],
  template: `
    <div
      class="px-4 py-8 min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 sm:px-6 lg:px-8"
    >
      <div class="mx-auto max-w-5xl">
        <!-- En-tête -->
        <div class="mb-12 text-center">
          <div
            class="inline-flex justify-center items-center mb-6 w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
          >
            <i class="text-3xl text-white fas fa-child"></i>
          </div>
          <h2 class="mb-3 text-4xl font-bold text-gray-900">
            {{ isEditMode ? 'Modifier' : 'Ajouter' }} un orphelin
          </h2>
          <p class="text-xl text-gray-600">
            Remplissez les informations avec attention
          </p>
        </div>

        <!-- Carte du formulaire -->
        <div class="p-8 bg-white rounded-2xl shadow-lg">
          <form
            [formGroup]="orphelinForm"
            (ngSubmit)="onSubmit()"
            class="space-y-6"
          >
            <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
              <!-- Nom -->
              <div class="form-field">
                <label class="block mb-2 text-sm font-medium text-gray-700">
                  <i class="mr-2 text-blue-500 fas fa-user"></i>
                  Nom
                </label>
                <input
                  type="text"
                  formControlName="nom"
                  class="px-4 py-2 w-full bg-gray-50 rounded-lg border border-gray-300 transition duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Entrez le nom"
                />
                <div
                  *ngIf="
                    orphelinForm.get('nom')?.touched &&
                    orphelinForm.get('nom')?.invalid
                  "
                  class="mt-1 text-sm text-red-500"
                >
                  Le nom est requis
                </div>
              </div>

              <!-- Âge -->
              <div class="form-field">
                <label class="block mb-2 text-sm font-medium text-gray-700">
                  <i class="mr-2 text-blue-500 fas fa-birthday-cake"></i>
                  Âge
                </label>
                <input
                  type="number"
                  formControlName="age"
                  class="px-4 py-2 w-full bg-gray-50 rounded-lg border border-gray-300 transition duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Entrez l'âge"
                />
                <div
                  *ngIf="
                    orphelinForm.get('age')?.touched &&
                    orphelinForm.get('age')?.invalid
                  "
                  class="mt-1 text-sm text-red-500"
                >
                  L'âge est requis et doit être compris entre 0 et 18 ans
                </div>
              </div>

              <!-- Genre -->
              <div class="form-field">
                <label class="block mb-2 text-sm font-medium text-gray-700">
                  <i class="mr-2 text-blue-500 fas fa-venus-mars"></i>
                  Genre
                </label>
                <div class="relative">
                  <select
                    formControlName="genre"
                    class="px-4 py-2 w-full text-gray-700 bg-white rounded-lg border border-gray-300 shadow-sm appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="" disabled>Sélectionnez un genre</option>
                    <option value="Masculin">Masculin</option>
                    <option value="Feminin">Féminin</option>
                  </select>
                  <div
                    class="flex absolute inset-y-0 right-0 items-center px-2 pointer-events-none"
                  >
                    <i class="text-gray-400 fas fa-chevron-down"></i>
                  </div>
                </div>
                <div
                  *ngIf="
                    orphelinForm.get('genre')?.touched &&
                    orphelinForm.get('genre')?.invalid
                  "
                  class="mt-1 text-sm text-red-500"
                >
                  Le genre est requis
                </div>
              </div>

              <!-- État de santé -->
              <div class="form-field">
                <label class="block mb-2 text-sm font-medium text-gray-700">
                  <i class="mr-2 text-blue-500 fas fa-heartbeat"></i>
                  État de santé
                </label>
                <div class="relative">
                  <select
                    formControlName="etatDeSante"
                    class="px-4 py-2 w-full text-gray-700 bg-white rounded-lg border border-gray-300 shadow-sm appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="" disabled>
                      Sélectionnez l'état de santé
                    </option>
                    <option value="EXCELLENT">Excellent</option>
                    <option value="BON">Bon</option>
                    <option value="MOYEN">Moyen</option>
                    <option value="MAUVAIS">Mauvais</option>
                  </select>
                  <div
                    class="flex absolute inset-y-0 right-0 items-center px-2 pointer-events-none"
                  >
                    <i class="text-gray-400 fas fa-chevron-down"></i>
                  </div>
                </div>
                <div
                  *ngIf="
                    orphelinForm.get('etatDeSante')?.touched &&
                    orphelinForm.get('etatDeSante')?.invalid
                  "
                  class="mt-1 text-sm text-red-500"
                >
                  L'état de santé est requis
                </div>
              </div>

              <!-- Niveau d'éducation -->
              <div class="form-field">
                <label class="block mb-2 text-sm font-medium text-gray-700">
                  <i class="mr-2 text-blue-500 fas fa-graduation-cap"></i>
                  Niveau d'éducation
                </label>
                <div class="relative">
                  <select
                    formControlName="niveauEducation"
                    class="px-4 py-2 w-full text-gray-700 bg-white rounded-lg border border-gray-300 shadow-sm appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="" disabled>
                      Sélectionnez le niveau d'éducation
                    </option>
                    <option value="PRIMAIRE">Primaire</option>
                    <option value="COLLEGE">Collège</option>
                    <option value="LYCEE">Lycée</option>
                  </select>
                  <div
                    class="flex absolute inset-y-0 right-0 items-center px-2 pointer-events-none"
                  >
                    <i class="text-gray-400 fas fa-chevron-down"></i>
                  </div>
                </div>
                <div
                  *ngIf="
                    orphelinForm.get('niveauEducation')?.touched &&
                    orphelinForm.get('niveauEducation')?.invalid
                  "
                  class="mt-1 text-sm text-red-500"
                >
                  Le niveau d'éducation est requis
                </div>
              </div>

              <!-- Tuteur -->
              <div class="form-field">
                <label class="block mb-2 text-sm font-medium text-gray-700">
                  <i class="mr-2 text-blue-500 fas fa-user-shield"></i>
                  Tuteur
                </label>
                <div class="relative">
                  <select
                    formControlName="tuteurId"
                    class="px-4 py-2 w-full text-gray-700 bg-white rounded-lg border border-gray-300 shadow-sm appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="" disabled>Sélectionnez un tuteur</option>
                    <option
                      *ngFor="let tuteur of tuteurs$ | async"
                      [value]="tuteur.id"
                    >
                      {{ tuteur.nom }} {{ tuteur.prenom }} (ID: {{ tuteur.id }})
                    </option>
                  </select>
                  <div
                    class="flex absolute inset-y-0 right-0 items-center px-2 pointer-events-none"
                  >
                    <i class="text-gray-400 fas fa-chevron-down"></i>
                  </div>
                </div>
                <div
                  *ngIf="
                    orphelinForm.get('tuteurId')?.touched &&
                    orphelinForm.get('tuteurId')?.invalid
                  "
                  class="mt-1 text-sm text-red-500"
                >
                  Le tuteur est requis
                </div>
              </div>
            </div>

            <!-- Boutons d'action -->
            <div
              class="flex justify-end pt-8 mt-8 space-x-4 border-t border-gray-200"
            >
              <button
                type="button"
                (click)="onCancel()"
                class="flex gap-2 items-center px-6 py-3 text-gray-700 bg-gray-100 rounded-lg transition-colors duration-200 hover:bg-gray-200"
              >
                <i class="fas fa-times"></i>
                <span>Annuler</span>
              </button>
              <button
                type="submit"
                [disabled]="!orphelinForm.valid || loading"
                class="flex gap-2 items-center px-6 py-3 text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg transition-colors duration-200 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <i class="fas fa-save"></i>
                <span>{{ isEditMode ? 'Modifier' : 'Enregistrer' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .form-field {
        @apply mb-6;
      }

      input:focus,
      select:focus {
        @apply outline-none ring-2 ring-blue-500 border-blue-500;
      }

      input,
      select {
        @apply transition-all duration-200;
      }

      .form-field label {
        @apply flex items-center text-gray-700 text-sm font-medium mb-2;
      }

      .form-field i {
        @apply mr-2 text-blue-500;
      }

      ::ng-deep {
        .mat-mdc-form-field {
          @apply w-full;
        }

        .mat-mdc-select-panel {
          @apply bg-white rounded-lg shadow-lg border border-gray-200;
        }

        .mat-mdc-option {
          @apply hover:bg-blue-50;
        }

        .mat-mdc-option.mat-selected:not(.mat-option-disabled) {
          @apply text-blue-600 bg-blue-50;
        }

        .mat-mdc-select-value {
          @apply text-gray-800;
        }

        .mat-mdc-form-field-outline {
          @apply border-2 border-gray-300;
        }

        .mat-mdc-form-field.mat-focused .mat-mdc-form-field-outline {
          @apply border-blue-500;
        }
      }
    `,
  ],
})
export class OrphelinFormComponent implements OnInit {
  orphelinForm!: FormGroup;
  isEditMode: boolean = false;
  loading: boolean = false;
  orphelinId: number | null = null;
  tuteurs$: Observable<Tuteur[]>;

  constructor(
    private fb: FormBuilder,
    private store: Store<{ orphelin: OrphelinState; tuteur: TuteurState }>,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.tuteurs$ = this.store.select(selectAllTuteurs);
    this.initForm();
  }

  ngOnInit(): void {
    this.store.dispatch(OrphelinActions.loadOrphelins());
    this.store.dispatch(TuteurActions.loadTuteurs());

    // Vérifier si nous sommes en mode édition
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEditMode = true;
      this.orphelinId = +id;
      this.loadOrphelin(this.orphelinId);
    }
  }

  private initForm(): void {
    this.orphelinForm = this.fb.group({
      nom: ['', [Validators.required]],
      age: ['', [Validators.required, Validators.min(0), Validators.max(18)]],
      genre: ['', [Validators.required]],
      etatDeSante: ['', [Validators.required]],
      niveauEducation: ['', [Validators.required]],
      tuteurId: ['', [Validators.required]],
    });
  }

  private loadOrphelin(id: number): void {
    this.store
      .select(OrphelinSelectors.selectOrphelinById(id))
      .subscribe((orphelin) => {
        if (orphelin) {
          console.log('Orphelin chargé:', orphelin);
          this.orphelinForm.patchValue({
            nom: orphelin.nom || '',
            age: orphelin.age || '',
            genre: orphelin.genre || '',
            etatDeSante: orphelin.etatDeSante || '',
            niveauEducation: orphelin.niveauEducation || '',
            tuteurId: orphelin.tuteurId ? orphelin.tuteurId.toString() : '',
          });
        } else {
          console.log("Aucun orphelin trouvé avec l'ID:", id);
        }
      });
  }

  onSubmit(): void {
    if (this.orphelinForm.valid) {
      const orphelinData = {
        ...this.orphelinForm.value,
        tuteurId: parseInt(this.orphelinForm.value.tuteurId, 10),
      };

      if (this.isEditMode && this.orphelinId) {
        console.log('Données de mise à jour:', orphelinData);
        this.store.dispatch(
          OrphelinActions.updateOrphelin({
            id: this.orphelinId,
            orphelin: orphelinData,
          })
        );
      } else {
        console.log('Données de création:', orphelinData);
        this.store.dispatch(
          OrphelinActions.createOrphelin({ orphelin: orphelinData })
        );
      }

      this.showNotification(
        `Orphelin ${this.isEditMode ? 'modifié' : 'ajouté'} avec succès`,
        'success'
      );
      setTimeout(() => {
        this.router.navigate(['/orphelins']);
      }, 1000);
    }
  }

  onCancel(): void {
    this.router.navigate(['/orphelins']);
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
}
