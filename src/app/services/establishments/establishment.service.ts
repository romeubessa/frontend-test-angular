import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Establishment } from '../../models/establishment.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EstablishmentService {

  private baseUrl = '/establishments';

  private headers = new HttpHeaders({
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  });

  constructor(private http: HttpClient) { }

  getAll(): Observable<HttpResponse<any>> {
    return this.http.get<Establishment[]>(environment.ambiente + this.baseUrl, { headers: this.headers, observe: 'response' });
  }

  getById(id: string): Observable<Establishment> {
    return this.http.get<Establishment>(`${environment.ambiente + this.baseUrl}/${id}`);
  }

  create(establishment: Establishment): Observable<Establishment> {
    return this.http.post<Establishment>(environment.ambiente + this.baseUrl, establishment);
  }

  update(id: string, establishment: Establishment): Observable<Establishment> {
    return this.http.put<Establishment>(`${environment.ambiente + this.baseUrl}/${id}`, establishment);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.ambiente + this.baseUrl}/${id}`);
  }
}
