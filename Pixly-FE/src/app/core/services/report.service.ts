import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { environment } from '../../../environments/environments';
import { Observable } from 'rxjs';
import { Report } from '../models/DTOs/Report';
import { ReportUpdateRequest } from '../models/UpdateRequest/ReportUpdateRequest';
import { ApiResponse } from '../models/Response/api-response';
import { ReportSearchRequest } from '../models/SearchRequest/ReportSearchRequest';
import { ReportType } from '../models/DTOs/ReportType';
import { ReportInsertRequest } from '../models/InsertRequest/ReportInsertRequest';
@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}`;


  constructor() { }

  getReports(reportRequest : ReportSearchRequest): Observable<ApiResponse<Report[]>> {
    let params = new HttpParams();

    Object.entries(reportRequest).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params = params.set(key, value.toString());
      }
    });

     return this.http.get<ApiResponse<Report[]>>(`${this.apiUrl}/report`, { params });
  }

  updateReport(reportId : number,reportUpdateRequest : ReportUpdateRequest): Observable<ApiResponse<Report>> {
    console.log(reportId);
    return this.http.patch<ApiResponse<Report>>(`${this.apiUrl}/report/${reportId}`, reportUpdateRequest);
  }

  getReportTypes(): Observable<ApiResponse<ReportType[]>> {
    return this.http.get<ApiResponse<ReportType[]>>(`${this.apiUrl}/report/reportTypes`);
  }

  createReport(formData: FormData): Observable<ApiResponse<Report>> {
    return this.http.post<ApiResponse<Report>>(`${this.apiUrl}/report`, formData);
  }

}
