import { createAction, props } from '@ngrx/store';
import { Activite } from '../../models/activite.model';

// Load Actions
export const loadActivites = createAction('[Activite] Load Activites');
export const loadActivitesSuccess = createAction(
  '[Activite] Load Activites Success',
  props<{ activites: Activite[] }>()
);
export const loadActivitesFailure = createAction(
  '[Activite] Load Activites Failure',
  props<{ error: any }>()
);

// Load Single Activite Actions
export const loadActivite = createAction(
  '[Activite] Load Single Activite',
  props<{ id: number }>()
);

export const loadActiviteSuccess = createAction(
  '[Activite] Load Single Activite Success',
  props<{ activite: Activite }>()
);

export const loadActiviteFailure = createAction(
  '[Activite] Load Single Activite Failure',
  props<{ error: any }>()
);

// Create Actions
export const createActivite = createAction(
  '[Activite] Create Activite',
  props<{ activite: Activite }>()
);
export const createActiviteSuccess = createAction(
  '[Activite] Create Activite Success',
  props<{ activite: Activite }>()
);
export const createActiviteFailure = createAction(
  '[Activite] Create Activite Failure',
  props<{ error: any }>()
);

// Update Actions
export const updateActivite = createAction(
  '[Activite] Update Activite',
  props<{ id: number; activite: Activite }>()
);
export const updateActiviteSuccess = createAction(
  '[Activite] Update Activite Success',
  props<{ activite: Activite }>()
);
export const updateActiviteFailure = createAction(
  '[Activite] Update Activite Failure',
  props<{ error: any }>()
);

// Delete Actions
export const deleteActivite = createAction(
  '[Activite] Delete Activite',
  props<{ id: number }>()
);
export const deleteActiviteSuccess = createAction(
  '[Activite] Delete Activite Success',
  props<{ id: number }>()
);
export const deleteActiviteFailure = createAction(
  '[Activite] Delete Activite Failure',
  props<{ error: any }>()
);

// Pagination Actions
export const setPage = createAction(
  '[Activite] Set Page',
  props<{ page: number; pageSize: number }>()
);

export const loadActivitesPage = createAction(
  '[Activite] Load Activites Page',
  props<{ page: number; pageSize: number }>()
);

export const loadActivitesPageSuccess = createAction(
  '[Activite] Load Activites Page Success',
  props<{
    activites: Activite[];
    totalElements: number;
    pageSize: number;
    currentPage: number;
  }>()
);

export const loadActivitesPageFailure = createAction(
  '[Activite] Load Activites Page Failure',
  props<{ error: any }>()
);

// Search Actions
export const setSearchTerm = createAction(
  '[Activite] Set Search Term',
  props<{ searchTerm: string }>()
);
