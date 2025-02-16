import { createAction, props } from '@ngrx/store';
import { Orphelin } from '../../models/orphelin.model';

// Load Orphelins
export const loadOrphelins = createAction('[Orphelin] Load Orphelins');
export const loadOrphelinsSuccess = createAction(
  '[Orphelin] Load Orphelins Success',
  props<{ orphelins: Orphelin[] }>()
);
export const loadOrphelinsFailure = createAction(
  '[Orphelin] Load Orphelins Failure',
  props<{ error: any }>()
);

// Create Orphelin
export const createOrphelin = createAction(
  '[Orphelin] Create Orphelin',
  props<{ orphelin: Orphelin }>()
);
export const createOrphelinSuccess = createAction(
  '[Orphelin] Create Orphelin Success',
  props<{ orphelin: Orphelin }>()
);
export const createOrphelinFailure = createAction(
  '[Orphelin] Create Orphelin Failure',
  props<{ error: any }>()
);

// Update Orphelin
export const updateOrphelin = createAction(
  '[Orphelin] Update Orphelin',
  props<{ id: number; orphelin: Orphelin }>()
);
export const updateOrphelinSuccess = createAction(
  '[Orphelin] Update Orphelin Success',
  props<{ orphelin: Orphelin }>()
);
export const updateOrphelinFailure = createAction(
  '[Orphelin] Update Orphelin Failure',
  props<{ error: any }>()
);

// Delete Orphelin
export const deleteOrphelin = createAction(
  '[Orphelin] Delete Orphelin',
  props<{ id: number }>()
);
export const deleteOrphelinSuccess = createAction(
  '[Orphelin] Delete Orphelin Success',
  props<{ id: number }>()
);
export const deleteOrphelinFailure = createAction(
  '[Orphelin] Delete Orphelin Failure',
  props<{ error: any }>()
);

// Search Orphelins
export const searchOrphelins = createAction(
  '[Orphelin] Search Orphelins',
  props<{ nomOrphelin: string }>()
);
export const searchOrphelinsSuccess = createAction(
  '[Orphelin] Search Orphelins Success',
  props<{ orphelins: Orphelin[] }>()
);
export const searchOrphelinsFailure = createAction(
  '[Orphelin] Search Orphelins Failure',
  props<{ error: any }>()
);
