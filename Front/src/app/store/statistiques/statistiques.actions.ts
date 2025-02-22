import { createAction, props } from '@ngrx/store';
import { Statistiques } from '../../models/statistiques.model';

export const loadStatistiques = createAction(
  '[Statistiques] Load Statistiques'
);
export const loadStatistiquesSuccess = createAction(
  '[Statistiques] Load Statistiques Success',
  props<{ statistiques: Statistiques }>()
);
export const loadStatistiquesFailure = createAction(
  '[Statistiques] Load Statistiques Failure',
  props<{ error: any }>()
);
