import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/Response/api-response';
import { Tag } from '../models/DTOs/Tag';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TagService {

    private apiUrl = `${environment.apiUrl}/tag`;

   constructor(private http: HttpClient) {}

  searchTags(query: string): Observable<ApiResponse<Tag[]>> {
    let params = new HttpParams();
    if (query) {
      params = params.set('name', query);
    }
    params = params.set('pageNumber', '1');
    params = params.set('pageSize', '20');

    return this.http.get<ApiResponse<Tag[]>>(this.apiUrl, { params });
  }

  getAllTags(): Observable<ApiResponse<Tag[]>> {
    let params = new HttpParams();
    params = params.set('pageNumber', '1');
    params = params.set('pageSize', '100');
    
    return this.http.get<ApiResponse<Tag[]>>(this.apiUrl, { params });
  }
}
