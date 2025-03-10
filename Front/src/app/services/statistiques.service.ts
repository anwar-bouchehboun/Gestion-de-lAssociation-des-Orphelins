import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class StatistiquesService {
  private apiUrl = environment.apiUrlStatistiques;

  constructor(private http: HttpClient) {}

  getStatistiquesGlobales(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}
