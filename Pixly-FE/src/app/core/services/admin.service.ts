import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { DashboardOverviewSearchRequest } from '../models/SearchRequest/DashboardOverviewSearchRequest';
import { Observable } from 'rxjs';
import { inject } from '@angular/core';
import { ApiResponse } from '../models/Response/api-response';
import { HttpClient } from '@angular/common/http';
import { DashboardOverview } from '../models/AdminDTOs/DashboardOverview';
@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private baseUrl = `${environment.apiUrl}/admin`;
  private http = inject(HttpClient);
  constructor() { }

  getDashboardOverview(request : DashboardOverviewSearchRequest): Observable<ApiResponse<DashboardOverview>>
  {
    return this.http.get<ApiResponse<DashboardOverview>>(`${this.baseUrl}`,  { params: request as any });
  }
}
