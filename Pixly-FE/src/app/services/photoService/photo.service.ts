import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { PhotoBasic } from '../../models/DTOs/PhotoBasic';
import { PaginationResponse } from '../../models/Pagination/PaginationResponse';
import { signal } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { PaginationHeader } from '../../models/Pagination/PaginationHeader';
import { ApiResponse } from '../../models/Response/api-response';
import { tap } from 'rxjs';
import { of } from 'rxjs';
import { PhotoSearchRequest } from '../../models/SearchRequest/PhotoSarchRequest';
@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  private http = inject(HttpClient);
  private apiUrl = "https://localhost:7136/api/photo";

  // Signals
  photos = signal<PhotoBasic[]>([]);
  paginationHeader = signal<PaginationHeader | null>(null);
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);

  private currentSearchRequest = new BehaviorSubject<Partial<PhotoSearchRequest>>({
    sorting: "Popular",
    pageNumber: 1,
    pageSize: 10
  });

  getPhotos(searchRequest: Partial<PhotoSearchRequest>): Observable<HttpResponse<ApiResponse<PhotoBasic[]>>> {
    this.isLoading.set(true);
    this.currentSearchRequest.next(searchRequest);

    if (searchRequest.pageNumber === 1) {
      this.photos.set([]);
    }
    
    let params = new HttpParams();

    Object.entries(searchRequest).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params = params.set(key, value.toString());
      }
    });

    return this.http.get<ApiResponse<PhotoBasic[]>>(this.apiUrl, { observe: 'response', params }).pipe(
      tap({
        next: (response) => {
          if(response.body?.success && response.body?.data) {
            if(searchRequest.pageNumber === 1) {
              this.photos.set(response.body.data);
            } else {
              this.photos.update((prevPhotos) => [...prevPhotos, ...response.body!.data]);
            }

            const paginationHeader = this.getPagionationFromResponse(response);
            if (paginationHeader) {
              this.paginationHeader.set(paginationHeader);
            }
          }
          this.isLoading.set(false);
          this.error.set(null);
        },
        error: (err) => {
          this.isLoading.set(false);
          this.error.set(err.message);
        }
      })
    );
  }

  loadMorePhotos(): Observable<HttpResponse<ApiResponse<PhotoBasic[]>>> {
    if (this.isLoading()) {
      return of() as Observable<HttpResponse<ApiResponse<PhotoBasic[]>>>;
    }
    
    const currentPage = this.paginationHeader()?.currentPage || 0;
    const nextPage = currentPage + 1;
    const totalPages = this.paginationHeader()?.totalPages || 0;
    
    if (nextPage > totalPages) {
      return of() as Observable<HttpResponse<ApiResponse<PhotoBasic[]>>>;
    }
    
    const currentRequest = this.currentSearchRequest.getValue();
    
    return this.getPhotos({
      ...currentRequest,
      pageNumber: nextPage
    });
  }

  getPagionationFromResponse(response: HttpResponse<any>): PaginationHeader | null {
    const paginationHeader = response.headers.get('Pagination');
    return paginationHeader ? JSON.parse(paginationHeader) : null;
  }

}
