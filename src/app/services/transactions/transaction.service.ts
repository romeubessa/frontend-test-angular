import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Transaction } from '../../models/transaction.model';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  private baseUrl = '/parking';

  private headers = new HttpHeaders({
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  });

  constructor(private http: HttpClient) { }

  entry(establishmentId: string, plate: string): Observable<Transaction> {
    const params = new HttpParams()
      .set('establishmentId', establishmentId)
      .set('plate', plate);
      return this.http.post<any>(`${environment.ambiente + this.baseUrl}/entry`, null, { params });
  }

  exit(establishmentId: string, plate: string): Observable<Transaction> {
    const params = new HttpParams()
      .set('establishmentId', establishmentId)
      .set('plate', plate);
      return this.http.post<any>(`${environment.ambiente + this.baseUrl}/exit`, null, { params });
  }
}
