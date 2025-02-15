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
import { ActiviteService } from '../../services/activite.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import * as ActiviteActions from '../../store/activite/activite.actions';
import * as ActiviteSelectors from '../../store/activite/activite.selectors';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

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
    <div class="p-6 bg-white rounded-lg shadow-lg">
      <form
        [formGroup]="activiteForm"
        (ngSubmit)="onSubmit()"
        class="space-y-6"
      >
        <h2 class="mb-6 text-2xl font-bold text-gray-800">
          {{ isEditMode ? 'Modifier' : 'Créer' }} une activité
        </h2>

        <mat-form-field class="mb-4 w-full">
          <mat-label>Nom</mat-label>
          <input matInput formControlName="nom" required />
        </mat-form-field>

        <mat-form-field class="mb-4 w-full">
          <mat-label>Description</mat-label>
          <textarea
            matInput
            formControlName="description"
            required
            rows="4"
          ></textarea>
        </mat-form-field>

        <mat-form-field class="mb-4 w-full">
          <mat-label>Budget</mat-label>
          <input matInput type="number" formControlName="budget" required />
        </mat-form-field>

        <mat-form-field class="w-full">
          <mat-label>Date</mat-label>
          <input
            matInput
            [matDatepicker]="picker"
            formControlName="date"
            required
          />
          <mat-datepicker-toggle
            matSuffix
            [for]="picker"
          ></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
          <mat-error *ngIf="activiteForm.get('date')?.hasError('required')">
            La date est requise
          </mat-error>
        </mat-form-field>

        <div class="flex gap-4 justify-end mt-6">
          <button
            mat-raised-button
            color="warn"
            type="button"
            (click)="onCancel()"
          >
            Annuler
          </button>
          <button
            mat-raised-button
            color="primary"
            type="submit"
            [disabled]="!activiteForm.valid"
          >
            {{ isEditMode ? 'Modifier' : 'Créer' }}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        max-width: 600px;
        margin: 2rem auto;
        padding: 0 1rem;
      }
    `,
  ],
})
export class ActiviteFormComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  activiteForm: FormGroup;
  isEditMode: boolean = false;
  activiteId: number | null = null;

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
      participants: [[]],
    });
  }

  ngOnInit(): void {
    // Charger d'abord toutes les activités
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
              this.activiteForm.patchValue({
                ...activite,
                date: new Date(activite.date),
              });
            }
          });
      }
    });
  }

  onSubmit(): void {
    if (this.activiteForm.valid) {
      const activite: Activite = {
        ...this.activiteForm.value,
        // dateDebut: this.activiteForm.value.dateDebut.toISOString(),
        // dateFin: this.activiteForm.value.dateFin.toISOString(),
      };

      if (this.isEditMode && this.activiteId) {
        this.store.dispatch(
          ActiviteActions.updateActivite({
            id: this.activiteId,
            activite,
          })
        );
      } else {
        this.store.dispatch(ActiviteActions.createActivite({ activite }));
      }

      this.router.navigate(['/activites']);
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
