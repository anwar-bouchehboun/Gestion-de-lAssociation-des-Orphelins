import { createFeatureSelector, createSelector } from '@ngrx/store';
import { OrphelinState } from './orphelin.reducer';

export const selectOrphelinState =
  createFeatureSelector<OrphelinState>('orphelin');

export const selectMainOrphelins = createSelector(
  selectOrphelinState,
  (state: OrphelinState) => state.mainOrphelins
);


export const selectAllOrphelins = createSelector(
  selectOrphelinState,
  (state: OrphelinState) => state.orphelins
);

export const selectOrphelinLoading = createSelector(
  selectOrphelinState,
  (state: OrphelinState) => state.loading
);

export const selectOrphelinError = createSelector(
  selectOrphelinState,
  (state: OrphelinState) => state.error
);

export const selectOrphelinById = (id: number) =>
  createSelector(selectAllOrphelins, (orphelins) =>
    orphelins.find((orphelin) => orphelin.id === id)
  );
