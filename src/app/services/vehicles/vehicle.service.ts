import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Vehicle } from '../../models/vehicle.model';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {

  private baseUrl = '/vehicles';

  private headers = new HttpHeaders({
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  });

  constructor(private http: HttpClient) { }

  getAll(): Observable<HttpResponse<any>> {
    return this.http.get<Vehicle[]>(environment.ambiente + this.baseUrl, { headers: this.headers, observe: 'response' });
  }

  getById(id: string): Observable<Vehicle> {
    return this.http.get<Vehicle>(`${environment.ambiente + this.baseUrl}/${id}`);
  }

  create(vehicle: Vehicle): Observable<Vehicle> {
    return this.http.post<Vehicle>(environment.ambiente + this.baseUrl, vehicle);
  }

  update(id: string, vehicle: Vehicle): Observable<Vehicle> {
    return this.http.put<Vehicle>(`${environment.ambiente + this.baseUrl}/${id}`, vehicle);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.ambiente + this.baseUrl}/${id}`);
  }
}
