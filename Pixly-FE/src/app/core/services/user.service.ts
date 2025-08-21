import {Injectable, inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {UserUpdateRequest} from '../models/UpdateRequest/UserUpdateRequest';
import {environment} from '../../../environments/environment';
import {ApiResponse} from '../models/Response/api-response';
import {User} from '../models/DTOs/User';
import {Observable} from 'rxjs';
import { UserSearchRequest } from '../models/SearchRequest/UserSearchRequest';
import { HttpParams } from '@angular/common/http';
import { PaginationService } from './pagination.service';
import { AuthState } from '../state/auth.state';
import { HttpResponse } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})

export class UserService {
  private baseUrl = `${environment.apiUrl}/user`;
  private authState = inject(AuthState);
  private paginationService = inject(PaginationService<User, UserSearchRequest>);
  
  constructor(private http: HttpClient) {}

  get users() { return this.paginationService.items; }
  get paginationHeader() { return this.paginationService.paginationHeader; }
  get isLoading() { return this.paginationService.isLoading; }
  get error() { return this.paginationService.error; }


  updateUser(id: string, requestBody: FormData): Observable<ApiResponse<User>> {
    return this.http.patch<ApiResponse<User>>(
      `${this.baseUrl}/${id}`,
      requestBody,
      { withCredentials: true }
    );
  }

  initialize(initialSearchRequest?: Partial<UserSearchRequest>): void {
      this.paginationService.initialize({
        baseUrl: this.baseUrl,
        initialSearchRequest: {
          pageNumber: 1,
          pageSize: 10,
          ...initialSearchRequest
        }
      });
  }

  getUsers(searchRequest: Partial<UserSearchRequest>): Observable<HttpResponse<ApiResponse<User[]>>> {
      return this.paginationService.getItems(this.baseUrl, searchRequest);
  }
  
  loadMoreUsers(): Observable<HttpResponse<ApiResponse<User[]>>> {
    return this.paginationService.loadMore(this.baseUrl);
  }
  
  refreshUsers(): Observable<HttpResponse<ApiResponse<User[]>>> {
    return this.paginationService.refresh(this.baseUrl);
  }

  updatePhotoSearch(searchUpdates: Partial<UserSearchRequest>): Observable<HttpResponse<ApiResponse<User[]>>> {
    return this.paginationService.updateSearch(this.baseUrl, searchUpdates);
    }
  
  getCurrentSearchRequest(): Partial<UserSearchRequest> {
    return this.paginationService.getCurrentSearchRequest();
    }
  
  clearPhotos(): void {
    this.paginationService.clear();
  }
}
