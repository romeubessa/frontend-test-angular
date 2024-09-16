import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  private baseUrl = '/reports';

  constructor(private http: HttpClient) { }

  getParkingSummary(establishmentId: string): Observable<any> {
    return this.http.get(`${environment.ambiente + this.baseUrl}/summary/${establishmentId}`);
  }

  getHourlyParkingSummary(establishmentId: string): Observable<any> {
    return this.http.get(`${environment.ambiente + this.baseUrl}/hourly-summary/${establishmentId}`);
  }

  getVehicleMovementReport(establishmentId: string, startDate: string, endDate: string): Observable<any> {
    return this.http.get(`${environment.ambiente + this.baseUrl}/vehicle-movements/${establishmentId}`, {
      params: {
        startDate: startDate,
        endDate: endDate
      }
    });
  }
}
