import { createReducer, on } from '@ngrx/store';
import { Statistiques } from '../../models/statistiques.model';
import {
  loadStatistiques,
  loadStatistiquesSuccess,
  loadStatistiquesFailure,
} from './statistiques.actions';

export interface StatistiquesState {
  statistiques: Statistiques | null;
  loading: boolean;
  error: string | null;
}

export const initialState: StatistiquesState = {
  statistiques: null,
  loading: false,
  error: null,
};

export const statistiquesReducer = createReducer(
  initialState,
  on(loadStatistiques, (state) => ({ ...state, loading: true })),
  on(loadStatistiquesSuccess, (state, { statistiques }) => ({
    ...state,
    statistiques,
    loading: false,
  })),
  on(loadStatistiquesFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  }))
);
