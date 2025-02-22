import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError, switchMap, tap, delay } from 'rxjs/operators';
import * as OrphelinActions from './orphelin.actions';
import { OrphelinService } from '../../services/orphelin.service';

@Injectable()
export class OrphelinEffects {
  constructor(
    private actions$: Actions,
    private orphelinService: OrphelinService
  ) {}

  loadOrphelins$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrphelinActions.loadOrphelins),
      mergeMap(() =>
        this.orphelinService.getAllOrphelins().pipe(
          map((orphelins) =>
            OrphelinActions.loadOrphelinsSuccess({ orphelins })
          ),
          catchError((error) =>
            of(OrphelinActions.loadOrphelinsFailure({ error }))
          )
        )
      )
    )
  );

  createOrphelin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrphelinActions.createOrphelin),
      mergeMap(({ orphelin }) =>
        this.orphelinService.createOrphelin(orphelin).pipe(
          map((newOrphelin) =>
            OrphelinActions.createOrphelinSuccess({ orphelin: newOrphelin })
          ),
          catchError((error) =>
            of(OrphelinActions.createOrphelinFailure({ error }))
          )
        )
      )
    )
  );

  updateOrphelin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrphelinActions.updateOrphelin),
      mergeMap(({ id, orphelin }) =>
        this.orphelinService.updateOrphelin(id, orphelin).pipe(
          map((updatedOrphelin) =>
            OrphelinActions.updateOrphelinSuccess({ orphelin: updatedOrphelin })
          ),
          catchError((error) =>
            of(OrphelinActions.updateOrphelinFailure({ error }))
          )
        )
      )
    )
  );

  deleteOrphelin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrphelinActions.deleteOrphelin),
      mergeMap(({ id }) =>
        this.orphelinService.deleteOrphelin(id).pipe(
          map(() => OrphelinActions.deleteOrphelinSuccess({ id })),
          catchError((error) =>
            of(OrphelinActions.deleteOrphelinFailure({ error }))
          )
        )
      )
    )
  );

  searchOrphelins$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrphelinActions.searchOrphelins),
      switchMap(({ nomOrphelin }) =>
        this.orphelinService.searchOrphelins(nomOrphelin).pipe(
          map((orphelins) =>
            OrphelinActions.searchOrphelinsSuccess({ orphelins })
          ),
          catchError((error) =>
            of(OrphelinActions.searchOrphelinsFailure({ error }))
          )
        )
      )
    )
  );

  loadOrphelinsPaginated$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrphelinActions.loadOrphelinsPaginated),
      mergeMap(({ page, size }) =>
        this.orphelinService.getAllOrphelinsPaginated(page, size).pipe(
          delay(2000),
          tap((response) => console.log('Réponse API orphelins paginés effecte:', response)),
          map((response) =>
            OrphelinActions.loadOrphelinsPaginatedSuccess({
              items: response.content,
              totalElements: response.totalElements,
              currentPage: response.number,
              pageSize: response.size,
            })
          ),
          catchError((error) =>
            of(OrphelinActions.loadOrphelinsPaginatedFailure({ error }))
          )
        )
      )
    )
  );
}
