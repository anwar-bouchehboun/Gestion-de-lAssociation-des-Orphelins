import { createAction, props } from '@ngrx/store';
import { Tuteur } from '../../models/tuteur.model';

export const createTuteur = createAction(
  '[Tuteur] Create Tuteur',
  props<{ tuteur: Tuteur }>()
);

export const createTuteurSuccess = createAction(
  '[Tuteur] Create Tuteur Success',
  props<{ tuteur: Tuteur }>()
);

export const createTuteurFailure = createAction(
  '[Tuteur] Create Tuteur Failure',
  props<{ error: any }>()
);

export const loadTuteurs = createAction('[Tuteur] Load Tuteurs');

export const loadTuteursSuccess = createAction(
  '[Tuteur] Load Tuteurs Success',
  props<{ tuteurs: Tuteur[] }>()
);

export const loadTuteursFailure = createAction(
  '[Tuteur] Load Tuteurs Failure',
  props<{ error: any }>()
);

export const updateTuteur = createAction(
  '[Tuteur] Update Tuteur',
  props<{ id: number; tuteur: Tuteur }>()
);

export const deleteTuteur = createAction(
  '[Tuteur] Delete Tuteur',
  props<{ id: number }>()
);

export const loadMainTuteurs = createAction('[Tuteur] Load Main Tuteurs');

export const loadMainTuteursSuccess = createAction(
  '[Tuteur] Load Main Tuteurs Success',
  props<{ tuteurs: Tuteur[] }>()
);

export const loadMainTuteursFailure = createAction(
  '[Tuteur] Load Main Tuteurs Failure',
  props<{ error: any }>()
);



export const loadTuteursPaginatedSuccess = createAction(
  '[Tuteur] Load Tuteurs Paginated Success',
  props<{ tuteurs: Tuteur[] }>()
);

export const loadTuteursPaginated = createAction(
  '[Tuteur] Load Tuteurs Paginated',
  props<{ page: number; size: number }>()
);




export const loadTuteursPaginatedFailure = createAction(
  '[Tuteur] Load Tuteurs Paginated Failure',
  props<{ error: any }>()
);









