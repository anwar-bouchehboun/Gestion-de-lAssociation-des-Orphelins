import { createFeatureSelector, createSelector } from '@ngrx/store';
import { StatistiquesState } from './statistiques.reducer';

export const selectStatistiquesState =
  createFeatureSelector<StatistiquesState>('statistiques');

export const selectAllStatistiques = createSelector(
  selectStatistiquesState,
  (state) => state.statistiques
);

export const selectStatistiquesLoading = createSelector(
  selectStatistiquesState,
  (state) => state.loading
);

export const selectStatistiquesError = createSelector(
  selectStatistiquesState,
  (state) => state.error
);
