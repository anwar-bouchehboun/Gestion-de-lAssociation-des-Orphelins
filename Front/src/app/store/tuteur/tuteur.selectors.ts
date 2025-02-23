import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TuteurState } from './tuteur.reducer';

export const selectTuteurState = createFeatureSelector<TuteurState>('tuteur');

export const selectAllTuteurs = createSelector(
  selectTuteurState,
  (state: TuteurState) => state.tuteurs
);

export const selectTuteurLoading = createSelector(
  selectTuteurState,
  (state: TuteurState) => state.loading
);

export const selectTuteurError = createSelector(
  selectTuteurState,
  (state: TuteurState) => state.error
);

export const selectMainTuteurs = createSelector(
  selectTuteurState,
  (state: TuteurState) => state.mainTuteurs
);

export const selectOrphelinById = (id: number) =>
  createSelector(selectAllTuteurs, (tuteurs) =>
    tuteurs.find((tuteur) => tuteur.id === id)
  );

export const selectSearchTerm = createSelector(
  selectTuteurState,
  (state: TuteurState) => state.searchTerm
);

export const selectFilteredTuteurs = createSelector(
  selectMainTuteurs,
  selectSearchTerm,
  (mainTuteurs, searchTerm) => {
    if (!searchTerm) return mainTuteurs.items;
    return mainTuteurs.items.filter(
      (tuteur) =>
        tuteur.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tuteur.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tuteur.cin.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
);



