import { createReducer, on } from '@ngrx/store';
import { Orphelin } from '../../models/orphelin.model';
import * as OrphelinActions from './orphelin.actions';

export interface OrphelinState {
  orphelins: Orphelin[];
  loading: boolean;
  error: any;
}

export const initialState: OrphelinState = {
  orphelins: [],
  loading: false,
  error: null,
};

export const orphelinReducer = createReducer(
  initialState,

  // Load Orphelins
  on(OrphelinActions.loadOrphelins, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(OrphelinActions.loadOrphelinsSuccess, (state, { orphelins }) => ({
    ...state,
    orphelins,
    loading: false,
  })),
  on(OrphelinActions.loadOrphelinsFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),

  // Create Orphelin
  on(OrphelinActions.createOrphelin, (state) => ({
    ...state,
    loading: true,
  })),
  on(OrphelinActions.createOrphelinSuccess, (state, { orphelin }) => ({
    ...state,
    orphelins: [...state.orphelins, orphelin],
    loading: false,
  })),
  on(OrphelinActions.createOrphelinFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),

  // Update Orphelin
  on(OrphelinActions.updateOrphelin, (state) => ({
    ...state,
    loading: true,
  })),
  on(OrphelinActions.updateOrphelinSuccess, (state, { orphelin }) => ({
    ...state,
    orphelins: state.orphelins.map((o) =>
      o.id === orphelin.id ? orphelin : o
    ),
    loading: false,
  })),
  on(OrphelinActions.updateOrphelinFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),

  // Delete Orphelin
  on(OrphelinActions.deleteOrphelin, (state) => ({
    ...state,
    loading: true,
  })),
  on(OrphelinActions.deleteOrphelinSuccess, (state, { id }) => ({
    ...state,
    orphelins: state.orphelins.filter((o) => o.id !== id),
    loading: false,
  })),
  on(OrphelinActions.deleteOrphelinFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),

  // Search Orphelins
  on(OrphelinActions.searchOrphelins, (state) => ({
    ...state,
    loading: true,
  })),
  on(OrphelinActions.searchOrphelinsSuccess, (state, { orphelins }) => ({
    ...state,
    orphelins,
    loading: false,
  })),
  on(OrphelinActions.searchOrphelinsFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  }))
);
