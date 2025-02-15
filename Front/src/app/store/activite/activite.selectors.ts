import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ActiviteState } from './activite.reducer';

export const selectActiviteState = (state: any) => state.activite;

export const selectAllActivites = createSelector(
  selectActiviteState,
  (state: ActiviteState) => state.activites
);

export const selectSearchTerm = createSelector(
  selectActiviteState,
  (state: ActiviteState) => state.searchTerm
);

export const selectFilteredActivites = createSelector(
  selectAllActivites,
  selectSearchTerm,
  (activites, searchTerm) => {
    if (!searchTerm) return activites;
    return activites.filter(
      (activite) =>
        activite.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activite.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
);

export const selectActivitesLoading = createSelector(
  selectActiviteState,
  (state) => state.loading
);

export const selectActivitesError = createSelector(
  selectActiviteState,
  (state) => state.error
);

export const selectActiviteById = (id: number) =>
  createSelector(selectAllActivites, (activites) => {
    console.log('activites selector', activites);
    return activites.find((activite) => activite.id === id);
  });
