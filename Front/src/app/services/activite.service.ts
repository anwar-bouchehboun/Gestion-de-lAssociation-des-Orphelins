import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of } from 'rxjs';
import { Activite } from '../models/activite.model';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class ActiviteService {
  private apiUrl = environment.apiUrlActivites;

  constructor(private http: HttpClient) {
    console.log('API URL:', this.apiUrl);
  }

  // Créer une nouvelle activité
  createActivite(activite: Activite): Observable<Activite> {
    return this.http.post<Activite>(this.apiUrl, activite);
  }

  // Récupérer toutes les activités
  getAllActivites(): Observable<Activite[]> {
    console.log('Appel API getAllActivites:', this.apiUrl);
    return this.http.get<Activite[]>(this.apiUrl + '/page').pipe(
      tap({
        next: (response) => console.log('Réponse API:', response),
        error: (error) => console.error('Erreur API:', error),
      })
    );
  }

  // Récupérer les activités avec pagination
  getActivitesPaginated(
    page: number,
    size: number,
    sortBy: string = 'id',
    desc: boolean = true
  ): Observable<Activite[]> {
    const params = {
      page: page.toString(),
      size: size.toString(),
      sort: sortBy,
      desc: desc.toString(),
    };

    return this.http
      .get<Activite[]>(`${this.apiUrl}/page`, { params })
      .pipe(
        tap((response) =>
          console.log('Réponse API avec tri:', { params, response })
        )
      );
  }

  // Récupérer une activité par son ID
  getActiviteById(id: number): Observable<Activite> {
    return this.http.get<Activite>(`${this.apiUrl}/${id}`);
  }

  // Mettre à jour une activité
  updateActivite(id: number, activite: Activite): Observable<Activite> {
    return this.http.put<Activite>(`${this.apiUrl}/${id}`, activite);
  }

  // Supprimer une activité
  deleteActivite(id: number): Observable<Activite> {
    return this.http.delete<Activite>(`${this.apiUrl}/${id}`);
  }

  // Rechercher des activités par nom
  searchActivites(nom: string): Observable<Activite[]> {
    console.log(`Recherche d'activités avec le terme: ${nom}`);
    return this.http
      .get<Activite[]>(`${this.apiUrl}/search`, {
        params: { nom },
      })
      .pipe(
        tap((response) => console.log('Résultats de recherche:', response)),
        catchError((error) => {
          // Retourner un tableau vide en cas d'erreur 404 (aucun résultat)
          if (error.error.status === 404) {
            console.log(`Aucune activité trouvée avec le terme "${nom}"`);
            console.log(error.error.message);

            return of([]);
          }
          // Pour les autres types d'erreurs, on les propage
          throw error;
        })
      );
  }

  // Créer plusieurs activités
  createMultipleActivites(activites: Activite[]): Observable<Activite[]> {
    return this.http.post<Activite[]>(`${this.apiUrl}/create-all`, activites);
  }

  getActivite(id: number): Observable<Activite> {
    return this.http.get<Activite>(`${this.apiUrl}/${id}`);
  }
}
