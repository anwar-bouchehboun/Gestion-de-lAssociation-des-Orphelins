import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { StatistiquesService } from '../../services/statistiques.service';
import {
  loadStatistiques,
  loadStatistiquesSuccess,
  loadStatistiquesFailure,
} from './statistiques.actions';
import { catchError, map, mergeMap, of, tap } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable()
export class StatistiquesEffects {
  constructor(
    private actions$: Actions,
    private statistiquesService: StatistiquesService
  ) {}

  loadStatistiques$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadStatistiques),
      mergeMap(() =>
        this.statistiquesService.getStatistiquesGlobales().pipe(
          delay(1500),
          tap((statistiques) => console.log('statistiques', statistiques)),
          map((statistiques) => loadStatistiquesSuccess({ statistiques })),
          catchError((error) => of(loadStatistiquesFailure({ error })))
        )
      )
    )
  );
}
