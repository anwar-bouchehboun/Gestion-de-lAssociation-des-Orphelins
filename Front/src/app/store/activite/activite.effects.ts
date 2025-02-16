import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError, tap, delay } from 'rxjs/operators';
import { ActiviteService } from '../../services/activite.service';
import * as ActiviteActions from './activite.actions';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class ActiviteEffects {
  loadActivites$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ActiviteActions.loadActivites),
      mergeMap(() =>
        this.activiteService.getAllActivites().pipe(
          map((response: any) => {
            const activites = response.content || response;
            return ActiviteActions.loadActivitesSuccess({ activites });
          }),
          catchError((error) =>
            of(ActiviteActions.loadActivitesFailure({ error }))
          )
        )
      )
    )
  );

  createActivite$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ActiviteActions.createActivite),
      mergeMap(({ activite }) =>
        this.activiteService.createActivite(activite).pipe(
          tap((newActivite) => console.log('newActivite Effecte', newActivite)),
          map((newActivite) =>
            ActiviteActions.createActiviteSuccess({ activite: newActivite })
          ),
          tap(() => {
            this.snackBar.open('Activité créée avec succès', 'Fermer', {
              duration: 3000,
            });
          }),
          catchError((error) => {
            this.snackBar.open('Erreur lors de la création', 'Fermer', {
              duration: 3000,
            });
            return of(ActiviteActions.createActiviteFailure({ error }));
          })
        )
      )
    )
  );

  updateActivite$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ActiviteActions.updateActivite),
      mergeMap(({ id, activite }) =>
        this.activiteService.updateActivite(id, activite).pipe(
          map((updatedActivite) =>
            ActiviteActions.updateActiviteSuccess({ activite: updatedActivite })
          ),
          tap(() => {
            this.snackBar.open('Activité mise à jour avec succès', 'Fermer', {
              duration: 3000,
            });
          }),
          catchError((error) => {
            this.snackBar.open('Erreur lors de la mise à jour', 'Fermer', {
              duration: 3000,
            });
            return of(ActiviteActions.updateActiviteFailure({ error }));
          })
        )
      )
    )
  );

  deleteActivite$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ActiviteActions.deleteActivite),
      mergeMap(({ id }) =>
        this.activiteService.deleteActivite(id).pipe(
          map(() => ActiviteActions.deleteActiviteSuccess({ id })),
          tap(() => {
            this.snackBar.open('Activité supprimée avec succès', 'Fermer', {
              duration: 3000,
            });
          }),
          catchError((error) => {
            this.snackBar.open('Erreur lors de la suppression', 'Fermer', {
              duration: 3000,
            });
            return of(ActiviteActions.deleteActiviteFailure({ error }));
          })
        )
      )
    )
  );

  loadSingleActivite$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ActiviteActions.loadActivite),
      mergeMap(({ id }) =>
        this.activiteService.getActivite(id).pipe(
          tap((activite) => console.log('activite', activite)),
          map((activite) => ActiviteActions.loadActiviteSuccess({ activite })),
          catchError((error) =>
            of(ActiviteActions.loadActiviteFailure({ error }))
          )
        )
      )
    )
  );

  loadActivitesPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ActiviteActions.loadActivitesPage),
      mergeMap(({ page, pageSize }) =>
        this.activiteService.getActivitesPaginated(page, pageSize).pipe(
          delay(2000),
          map((response: any) => {
            return ActiviteActions.loadActivitesPageSuccess({
              activites: response.content,
              totalElements: response.totalElements,
              pageSize: response.size,
              currentPage: response.number,
            });
          }),
          catchError((error) =>
            of(ActiviteActions.loadActivitesPageFailure({ error }))
          )
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private activiteService: ActiviteService,
    private snackBar: MatSnackBar
  ) {}
}
