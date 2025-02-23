import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tuteur } from '../models/tuteur.model';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class TuteurService {
  private apiUrl = `${environment.apiUrlTuteurs}`;

  constructor(private http: HttpClient) {}

  // Créer un nouveau tuteur
  createTuteur(tuteur: Tuteur): Observable<any> {
    return this.http.post<any>(this.apiUrl, tuteur);
  }

  // Créer plusieurs tuteurs
  createMultipleTuteurs(tuteurs: Tuteur[]): Observable<Tuteur[]> {
    return this.http.post<Tuteur[]>(`${this.apiUrl}/multiple`, tuteurs);
  }

  // Obtenir un tuteur par son ID
  getTuteurById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Obtenir tous les tuteurs
  getAllTuteurs(): Observable<Tuteur[]> {
    return this.http.get<Tuteur[]>(this.apiUrl);
  }

  // Rechercher un tuteur par son nom
  searchTuteurByNom(nomTuteur: string): Observable<any> {
    const params = new HttpParams().set('nomTuteur', nomTuteur);
    return this.http.get<any>(`${this.apiUrl}/search`, { params });
  }

  // Obtenir les tuteurs avec pagination
  getTuteursPaginated(page: number, size: number): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<any>(`${this.apiUrl}/page`, { params });
  }

  // Mettre à jour un tuteur
  updateTuteur(id: number, tuteur: Tuteur): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, tuteur);
  }

  // Supprimer un tuteur
  deleteTuteur(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  // Méthode utilitaire pour gérer les erreurs
  private handleError(error: any): Observable<never> {
    console.error('Une erreur est survenue:', error);
    throw error;
  }
}
