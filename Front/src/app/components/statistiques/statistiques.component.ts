import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Statistiques } from '../../models/statistiques.model';
import { MatCardModule } from '@angular/material/card';
import { Chart, registerables } from 'chart.js';
import {
  loadStatistiques,
  loadStatistiquesFailure,
  loadStatistiquesSuccess,
} from '../../store/statistiques/statistiques.actions';
import {
  selectAllStatistiques,
  selectStatistiquesLoading,
} from '../../store/statistiques/statistiques.selectors';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

Chart.register(...registerables);

@Component({
  selector: 'app-statistiques',
  standalone: true,
  templateUrl: './statistiques.component.html',
  styleUrls: ['./statistiques.component.css'],
  imports: [MatCardModule, CommonModule, MatIconModule],
})
export class StatistiquesComponent implements OnInit {
  statistiques$: Observable<Statistiques | null>;
  loading$: Observable<boolean>;
  isLoading: boolean = true;
  error: string | null = null;

  constructor(private store: Store) {
    this.statistiques$ = this.store.select(selectAllStatistiques);
    this.loading$ = this.store.select(selectStatistiquesLoading);
  }

  ngOnInit() {
    this.isLoading = true;
    this.store.dispatch(loadStatistiques());
    this.statistiques$.subscribe(
      (statistiques) => {
        console.log('Statistiques page:', statistiques);
        this.isLoading = false;
      },
      (error) => {
        this.error = error;
        this.isLoading = false;
      }
    );
  }

  ngAfterViewInit() {
    const ctxActivites = document.getElementById(
      'activitesChart'
    ) as HTMLCanvasElement;
    const ctxOrphelins = document.getElementById(
      'orphelinsChart'
    ) as HTMLCanvasElement;

    this.statistiques$.subscribe(
      (statistiques) => {
        if (statistiques) {
          this.isLoading = false;
          // Graphique des Activités par Mois
          const labelsActivites = Object.keys(statistiques.activitesParMois);
          const dataActivites = Object.values(statistiques.activitesParMois);

          new Chart(ctxActivites, {
            type: 'bar',
            data: {
              labels: labelsActivites,
              datasets: [
                {
                  label: 'Activités par Mois',
                  data: dataActivites,
                  backgroundColor: '#1E3A8A',
                },
              ],
            },
            options: {
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                },
              },
            },
          });

          // Graphique des Orphelins par Tuteur
          const labelsOrphelins = Object.keys(statistiques.orphelinsParTuteur);
          const dataOrphelins = Object.values(statistiques.orphelinsParTuteur);

          new Chart(ctxOrphelins, {
            type: 'pie',
            data: {
              labels: labelsOrphelins,
              datasets: [
                {
                  label: 'Orphelins par Tuteur',
                  data: dataOrphelins,
                  backgroundColor: ['#10B981', '#FBBF24', '#EF4444'],
                },
              ],
            },
            options: {
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                },
              },
            },
          });
        }
      },
      (error) => {
        this.error = error;
        this.isLoading = false;
      }
    );
  }
}
