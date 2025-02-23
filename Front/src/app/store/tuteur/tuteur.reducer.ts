import { createReducer, on } from '@ngrx/store';
import { Tuteur } from '../../models/tuteur.model';
import * as TuteurActions from './tuteur.actions';

export interface TuteurState {
  mainTuteurs: {
    items: Tuteur[];
    totalElements: number;
    currentPage: number;
    pageSize: number;
  };
  tuteurs: Tuteur[];
  loading: boolean;
  error: any;
  searchTerm: string;
}

export const initialState: TuteurState = {
  mainTuteurs: {
    items: [],
    totalElements: 0,
    currentPage: 0,
    pageSize: 6,
  },
  tuteurs: [],
  loading: false,
  error: null,
  searchTerm: '',
};

export const tuteurReducer = createReducer(
  initialState,
  on(TuteurActions.loadTuteurs, (state) => ({ ...state, loading: true })),
  on(TuteurActions.loadTuteursSuccess, (state, { tuteurs }) => ({
    ...state,
    loading: false,
    tuteurs,
  })),
  on(TuteurActions.loadTuteursFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(TuteurActions.createTuteur, (state) => ({ ...state, loading: true })),
  on(TuteurActions.createTuteurSuccess, (state, { tuteur }) => ({
    ...state,
    loading: false,
    tuteurs: [...state.tuteurs, tuteur],
  })),
  on(TuteurActions.createTuteurFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(TuteurActions.updateTuteur, (state) => ({ ...state, loading: true })),
  on(TuteurActions.deleteTuteur, (state, { id }) => ({
    ...state,
    tuteurs: state.tuteurs.filter((t) => t.id !== id),
  })),
  on(TuteurActions.loadMainTuteurs, (state) => ({ ...state, loading: true })),
  on(TuteurActions.loadMainTuteursSuccess, (state, { tuteurs }) => ({
    ...state,
    loading: false,
    mainTuteurs: { ...state.mainTuteurs, items: tuteurs },
  })),
  on(TuteurActions.loadMainTuteursFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(TuteurActions.loadTuteursPaginated, (state) => ({ ...state, loading: true })),
  on(TuteurActions.loadTuteursPaginatedSuccess, (state, { tuteurs }) => ({
    ...state,
    loading: false,
    mainTuteurs: { ...state.mainTuteurs, items: tuteurs },
  })),
  on(TuteurActions.loadTuteursPaginatedFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),



);
