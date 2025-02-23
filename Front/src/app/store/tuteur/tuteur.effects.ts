import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import {
  map,
  mergeMap,
  catchError,
  switchMap,
  tap,
  delay,
} from 'rxjs/operators';
import * as TuteurActions from './tuteur.actions';
import { TuteurService } from '../../services/tuteur.service';

@Injectable()
export class TuteurEffects {
  constructor(
    private actions$: Actions,
    private tuteurService: TuteurService
  ) {}

  // Charger tous les tuteurs
  loadTuteurs$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TuteurActions.loadTuteurs),
      mergeMap(() =>
        this.tuteurService.getAllTuteurs().pipe(
          map((tuteurs) => TuteurActions.loadTuteursSuccess({ tuteurs })),
          catchError((error) => of(TuteurActions.loadTuteursFailure({ error })))
        )
      )
    )
  );

  // Créer un tuteur
  createTuteur$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TuteurActions.createTuteur),
      mergeMap(({ tuteur }) =>
        this.tuteurService.createTuteur(tuteur).pipe(
          map((newTuteur) =>
            TuteurActions.createTuteurSuccess({ tuteur: newTuteur })
          ),
          catchError((error) =>
            of(TuteurActions.createTuteurFailure({ error }))
          )
        )
      )
    )
  );

  // Mettre à jour un tuteur
  updateTuteur$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TuteurActions.updateTuteur),
      mergeMap(({ id, tuteur }) =>
        this.tuteurService.updateTuteur(id, tuteur).pipe(
          map((updatedTuteur) => TuteurActions.loadTuteurs()),
          catchError((error) => of(TuteurActions.loadTuteursFailure({ error })))
        )
      )
    )
  );

  // Supprimer un tuteur
  deleteTuteur$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TuteurActions.deleteTuteur),
      mergeMap(({ id }) =>
        this.tuteurService.deleteTuteur(id).pipe(
          map(() => TuteurActions.loadTuteurs()),
          catchError((error) => of(TuteurActions.loadTuteursFailure({ error })))
        )
      )
    )
  );

  // Charger les tuteurs avec pagination
  loadTuteursPaginated$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TuteurActions.loadTuteursPaginated),
      mergeMap(({ page, size }) =>
        this.tuteurService.getTuteursPaginated(page, size).pipe(
          map((response) =>
            TuteurActions.loadTuteursPaginatedSuccess({
              tuteurs: response.content,
            })
          ),
          catchError((error) =>
            of(TuteurActions.loadTuteursPaginatedFailure({ error }))
          )
        )
      )
    )
  );

  // Charger les tuteurs principaux
  loadMainTuteurs$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TuteurActions.loadMainTuteurs),
      mergeMap(() =>
        this.tuteurService.getAllTuteurs().pipe(
          map((tuteurs) => TuteurActions.loadMainTuteursSuccess({ tuteurs })),
          catchError((error) =>
            of(TuteurActions.loadMainTuteursFailure({ error }))
          )
        )
      )
    )
  );
}
