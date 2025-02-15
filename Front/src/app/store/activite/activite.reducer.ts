import { createReducer, on } from '@ngrx/store';
import { Activite } from '../../models/activite.model';
import * as ActiviteActions from './activite.actions';

export interface ActiviteState {
  activites: Activite[];
  loading: boolean;
  error: any;
  totalElements: number;
  pageSize: number;
  currentPage: number;
  searchTerm: string;
}

export const initialState: ActiviteState = {
  activites: [],
  loading: false,
  error: null,
  totalElements: 0,
  pageSize: 6,
  currentPage: 0,
  searchTerm: '',
};

export const activiteReducer = createReducer(
  initialState,

  // Pagination
  on(ActiviteActions.setPage, (state, { page, pageSize }) => ({
    ...state,
    currentPage: page,
    pageSize: pageSize,
  })),

  on(ActiviteActions.loadActivitesPage, (state) => ({
    ...state,
    loading: true,
  })),

  on(
    ActiviteActions.loadActivitesPageSuccess,
    (state, { activites, totalElements, pageSize, currentPage }) => ({
      ...state,
      activites,
      totalElements,
      pageSize,
      currentPage,
      loading: false,
    })
  ),

  on(ActiviteActions.loadActivitesPageFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),

  // Load
  on(ActiviteActions.loadActivites, (state) => ({
    ...state,
    loading: true,
  })),
  on(ActiviteActions.loadActivitesSuccess, (state, { activites }) => ({
    ...state,
    activites,
    loading: false,
  })),
  on(ActiviteActions.loadActivitesFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),

  // Load Single Activite
  on(ActiviteActions.loadActivite, (state) => ({
    ...state,
    loading: true,
  })),
  on(ActiviteActions.loadActiviteSuccess, (state, { activite }) => ({
    ...state,
    activites: state.activites.some((a) => a.id === activite.id)
      ? state.activites.map((a) => (a.id === activite.id ? activite : a))
      : [...state.activites, activite],
    loading: false,
  })),
  on(ActiviteActions.loadActiviteFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),

  // Create
  on(ActiviteActions.createActivite, (state) => ({
    ...state,
    loading: true,
  })),
  on(ActiviteActions.createActiviteSuccess, (state, { activite }) => ({
    ...state,
    activites: [...state.activites, activite],
    loading: false,
  })),
  on(ActiviteActions.createActiviteFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),

  // Update
  on(ActiviteActions.updateActivite, (state) => ({
    ...state,
    loading: true,
  })),
  on(ActiviteActions.updateActiviteSuccess, (state, { activite }) => ({
    ...state,
    activites: state.activites.map((a) =>
      a.id === activite.id ? activite : a
    ),
    loading: false,
  })),
  on(ActiviteActions.updateActiviteFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),

  // Delete
  on(ActiviteActions.deleteActivite, (state) => ({
    ...state,
    loading: true,
  })),
  on(ActiviteActions.deleteActiviteSuccess, (state, { id }) => ({
    ...state,
    activites: state.activites.filter((a) => a.id !== id),
    loading: false,
  })),
  on(ActiviteActions.deleteActiviteFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),

  on(ActiviteActions.setSearchTerm, (state, { searchTerm }) => ({
    ...state,
    searchTerm,
  }))
);
