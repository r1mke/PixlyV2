import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Report } from '../models/DTOs/Report';
import { ReportUpdateRequest } from '../models/UpdateRequest/ReportUpdateRequest';
import { ApiResponse } from '../models/Response/api-response';
import { ReportSearchRequest } from '../models/SearchRequest/ReportSearchRequest';
@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/report`;

  constructor() { }

  getReports(reportRequest : ReportSearchRequest): Observable<ApiResponse<Report[]>> {
    let params = new HttpParams();

    Object.entries(reportRequest).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params = params.set(key, value.toString());
      }
    });

     return this.http.get<ApiResponse<Report[]>>(`${this.apiUrl}`, { params });
  }

  updateReport(reportId : number,reportUpdateRequest : ReportUpdateRequest): Observable<ApiResponse<Report>> {
    console.log(reportId);
    return this.http.patch<ApiResponse<Report>>(`${this.apiUrl}/${reportId}`, reportUpdateRequest);
  }

}
