import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { PhotoBasic } from '../models/DTOs/PhotoBasic';
import { PaginationResponse } from '../models/Pagination/PaginationResponse';
import { signal } from '@angular/core';
import { BehaviorSubject, catchError, EMPTY, map, Observable, of, Subject, switchMap, take } from 'rxjs';
import { PaginationHeader } from '../models/Pagination/PaginationHeader';
import { ApiResponse } from '../models/Response/api-response';
import { PhotoSearchRequest } from '../models/SearchRequest/PhotoSarchRequest';
import { AuthState } from '../state/auth.state';
import { PhotoInsertRequest } from '../models/InsertRequest/PhotoInsertRequest';
import { PhotoDetail } from '../models/DTOs/PhotoDetail';
import { AuthService } from './auth.service';
import { PaginationService } from './pagination.service';
import { environment } from '../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private apiUrl = `${environment.apiUrl}/photo`;
  private authState = inject(AuthState);
  private paginationService = inject(PaginationService<PhotoBasic, PhotoSearchRequest>);

  private get currentUserId(): string | undefined {
    return this.authState.currentUser?.id;
  }

  get photos() { return this.paginationService.items; }
  get paginationHeader() { return this.paginationService.paginationHeader; }
  get isLoading() { return this.paginationService.isLoading; }
  get error() { return this.paginationService.error; }

  initialize(initialSearchRequest?: Partial<PhotoSearchRequest>): void {
    this.paginationService.initialize({
      baseUrl: this.apiUrl,
      initialSearchRequest: {
        sorting: 'Popular',
        pageNumber: 1,
        pageSize: 10,
        ...initialSearchRequest
      }
    });
  }

  getPhotos(searchRequest: Partial<PhotoSearchRequest>): Observable<HttpResponse<ApiResponse<PhotoBasic[]>>> {
    return this.paginationService.getItems(this.apiUrl, searchRequest);
  }

  loadMorePhotos(): Observable<HttpResponse<ApiResponse<PhotoBasic[]>>> {
    return this.paginationService.loadMore(this.apiUrl);
  }

  refreshPhotos(): Observable<HttpResponse<ApiResponse<PhotoBasic[]>>> {
    return this.paginationService.refresh(this.apiUrl);
  }

  updatePhotoSearch(searchUpdates: Partial<PhotoSearchRequest>): Observable<HttpResponse<ApiResponse<PhotoBasic[]>>> {
    return this.paginationService.updateSearch(this.apiUrl, searchUpdates);
  }

  getCurrentSearchRequest(): Partial<PhotoSearchRequest> {
    return this.paginationService.getCurrentSearchRequest();
  }

  getPhotoBySlug(slug: string): Observable<ApiResponse<PhotoDetail>> {
  return this.authService.getCurrentUser().pipe(
    catchError(() => of(null)),                    
    take(1),
    switchMap(() => {
      const currentUserId = this.authState.currentUser?.id;

      let params = new HttpParams();
      if (currentUserId) params = params.set('currentUserId', currentUserId);

      return this.http.get<ApiResponse<PhotoDetail>>(
        `${this.apiUrl}/slug/${slug}`,
        { params }
      );
    })
  );}

  getPagionationFromResponse(response: HttpResponse<any>): PaginationHeader | null {
    const paginationHeader = response.headers.get('Pagination');
    return paginationHeader ? JSON.parse(paginationHeader) : null;
  }

  // Photo actions
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

  uploadPhoto(formData: FormData): Observable<ApiResponse<PhotoBasic>> {
    return this.http.post<ApiResponse<PhotoBasic>>(this.apiUrl, formData);
  }

  // Admin actions
  approvePhoto(photoId: number): Observable<ApiResponse<PhotoBasic>> {
    return this.http.post<ApiResponse<PhotoBasic>>(`${this.apiUrl}/${photoId}/approve`, {});
  }

  rejectPhoto(photoId: number): Observable<ApiResponse<PhotoBasic>> {
    return this.http.post<ApiResponse<PhotoBasic>>(`${this.apiUrl}/${photoId}/reject`, {});
  }

  editPhoto(photoId: number): Observable<ApiResponse<PhotoBasic>> {
    return this.http.post<ApiResponse<PhotoBasic>>(`${this.apiUrl}/${photoId}/edit`, {});
  }

  hidePhoto(photoId: number): Observable<ApiResponse<PhotoBasic>> {
    return this.http.post<ApiResponse<PhotoBasic>>(`${this.apiUrl}/${photoId}/hide`, {});
  }

  deletePhoto(photoId: number): Observable<ApiResponse<PhotoBasic>> {
    return this.http.post<ApiResponse<PhotoBasic>>(`${this.apiUrl}/${photoId}/delete`, {});
  }

  restorePhoto(photoId: number): Observable<ApiResponse<PhotoBasic>> {
    return this.http.post<ApiResponse<PhotoBasic>>(`${this.apiUrl}/${photoId}/restore`, {});
  }

  // Helper methods for updating local state after actions
  updatePhotoInList(photoId: number, updater: (photo: PhotoBasic) => PhotoBasic): void {
    this.paginationService.updateItem(
      photo => photo.photoId === photoId,
      updater
    );
  }

  removePhotoFromList(photoId: number): void {
    this.paginationService.removeItem(photo => photo.photoId === photoId);
  }

  addPhotoToList(photo: PhotoBasic): void {
    this.paginationService.addItem(photo);
  }

  getPreviewLink(photoId: number) {
  return this.http
    .get<{ data: string }>(`${this.apiUrl}/preview/${photoId}`)
    .pipe(map(r => r.data));
}
}