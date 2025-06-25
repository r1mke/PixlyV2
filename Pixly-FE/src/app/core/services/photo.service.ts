import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { PhotoBasic } from '../models/DTOs/PhotoBasic';
import { PaginationResponse } from '../models/Pagination/PaginationResponse';
import { signal } from '@angular/core';
import { BehaviorSubject, EMPTY, Observable, Subject } from 'rxjs';
import { PaginationHeader } from '../models/Pagination/PaginationHeader';
import { ApiResponse } from '../models/Response/api-response';
import { tap } from 'rxjs';
import { of } from 'rxjs';
import isEqual from 'lodash.isequal';
import { SearchService } from './search.service';
import { PhotoSearchRequest } from '../models/SearchRequest/PhotoSarchRequest';
import {AuthState} from '../state/auth.state';
import {environment} from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  private http = inject(HttpClient);
  private authState = inject(AuthState);
  private apiUrl = `${environment.apiUrl}/photo`;
  private get currentUserId(): string | undefined{
    return this.authState.currentUser?.id;
  }

  // Signals
  photos = signal<PhotoBasic[]>([]);
  paginationHeader = signal<PaginationHeader | null>(null);
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);
  searchService = inject(SearchService);
  private currentSearchRequest = new BehaviorSubject<Partial<PhotoSearchRequest>>({
    sorting: 'Popular',
    pageNumber: 1,
    pageSize: 5
  });

  getPhotos(searchRequest: Partial<PhotoSearchRequest>): Observable<HttpResponse<ApiResponse<PhotoBasic[]>>> {

    this.currentSearchRequest.next(searchRequest);
    this.isLoading.set(true);

    if (searchRequest.pageNumber === 1) {
      this.photos.set([]);
    }

    let params = new HttpParams();

    Object.entries(searchRequest).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params = params.set(key, value.toString());
      }
    });
    console.log("pozivam api", params);
    return this.http.get<ApiResponse<PhotoBasic[]>>(this.apiUrl, { observe: 'response', params }).pipe(
      tap({
        next: (response) => {
          if(response.body?.success && response.body?.data) {
            if(searchRequest.pageNumber === 1) {
              this.photos.set(response.body.data);
              console.log(response.body.data);
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
      return EMPTY;
    }

    const currentPage = this.paginationHeader()?.currentPage || 0;
    const nextPage = currentPage + 1;
    const totalPages = this.paginationHeader()?.totalPages || 0;

    if (nextPage > totalPages) {
      return EMPTY;
    }

    const currentRequest = this.searchService.getSearchObject();

    return this.getPhotos({
      ...currentRequest,
      pageNumber: nextPage
    });
  }

  getPagionationFromResponse(response: HttpResponse<any>): PaginationHeader | null {
    const paginationHeader = response.headers.get('Pagination');
    return paginationHeader ? JSON.parse(paginationHeader) : null;
  }

  likePhoto(photoId: number): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(
      `${this.apiUrl}/${photoId}/like?userId=${this.currentUserId}`,
      {}
    );
  }

  unlikePhoto(photoId: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(
      `${this.apiUrl}/${photoId}/like?userId=${this.currentUserId}`,
      {}
    );
  }

  savePhoto(photoId: number): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(
      `${this.apiUrl}/${photoId}/save?userId=${this.currentUserId}`,
      {}
    );
  }

  unsavePhoto(photoId: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(
      `${this.apiUrl}/${photoId}/save?userId=${this.currentUserId}`,
      {}
    );
  }


}
