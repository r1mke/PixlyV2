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

  private currentContextSubject = new BehaviorSubject<{
   mode: 'home' | 'search' | 'profile' | 'liked' | 'saved';
   searchRequest: Partial<PhotoSearchRequest>; 
  }>({mode: 'home', searchRequest: {username: null, title: null, orientation: null, size: null, isUserIncluded: null, sorting: null, isLiked: null, isSaved: null, pageNumber: 1, pageSize: 10}});

  getPopularPhotos(searchRequest: Partial<PhotoSearchRequest>): Observable<HttpResponse<ApiResponse<PhotoBasic[]>>> {
   this.isLoading.set(true);

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
              console.log(this.photos());
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

  loadPhotosForContext(context : {
    mode: 'home' | 'search' | 'profile' | 'liked' | 'saved';
    searchRequest: Partial<PhotoSearchRequest>; 
  }) : Observable<HttpResponse<ApiResponse<PhotoBasic[]>>> {

    this.currentContextSubject.next(context);

    const pageNumber = context.searchRequest?.pageNumber || 1;
    const pageSize = context.searchRequest?.pageSize || 10;

    if(pageNumber === 1) {
      this.photos.set([]);
    }

    this.isLoading.set(true);

    return this.getPopularPhotos(context.searchRequest!);
  }

   loadMorePhotos(): Observable<HttpResponse<ApiResponse<PhotoBasic[]>>> {
    if (this.isLoading()) return of() as Observable<HttpResponse<ApiResponse<PhotoBasic[]>>>;
    
    const currentPage = this.paginationHeader()?.currentPage || 0;
    const nextPage = currentPage + 1;
    const totalPages = this.paginationHeader()?.totalPages || 0;
    
    if (nextPage > totalPages) {
      return of() as Observable<HttpResponse<ApiResponse<PhotoBasic[]>>>;
    }
    
    const currentContext = this.currentContextSubject.value;
    
    return this.loadPhotosForContext({
      ...currentContext,
      searchRequest: {...currentContext.searchRequest!, pageNumber: nextPage }
    });
    
  }


  getPagionationFromResponse(response: HttpResponse<any>): PaginationHeader | null {
    const paginationHeader = response.headers.get('Pagination');
    return paginationHeader ? JSON.parse(paginationHeader) : null;
  }

}
