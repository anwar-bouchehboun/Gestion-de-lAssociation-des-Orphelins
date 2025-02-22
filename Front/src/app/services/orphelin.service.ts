import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Orphelin } from '../models/orphelin.model';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class OrphelinService {
  private apiUrl = environment.apiUrlOrphelins;

  constructor(private http: HttpClient) {}

  getAllOrphelins(): Observable<Orphelin[]> {
    return this.http.get<Orphelin[]>(`${this.apiUrl}`);
  }

  getOrphelinById(id: number): Observable<Orphelin> {
    return this.http.get<Orphelin>(`${this.apiUrl}/${id}`);
  }

  createOrphelin(orphelin: Orphelin): Observable<Orphelin> {
    return this.http.post<Orphelin>(`${this.apiUrl}`, orphelin);
  }

  updateOrphelin(id: number, orphelin: Orphelin): Observable<Orphelin> {
    return this.http.put<Orphelin>(`${this.apiUrl}/${id}`, orphelin);
  }

  deleteOrphelin(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  searchOrphelins(nomOrphelin: string): Observable<Orphelin[]> {
    return this.http.get<Orphelin[]>(`${this.apiUrl}/search`, {
      params: { nomOrphelin },
    });
  }

  getAllOrphelinsPaginated(
    page: number = 0,
    size: number = 6
  ): Observable<any> {
    const params = {
      page: page.toString(),
      size: size.toString(),
    };
    return this.http.get<any>(`${this.apiUrl}/page`, { params }).pipe(
      tap({
        next: (response) =>
          console.log('Réponse API orphelins paginés:', response),
        error: (error) => console.error('Erreur API orphelins paginés:', error),
      })
    );
  }


}
