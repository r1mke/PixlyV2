import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {UserUpdateRequest} from '../models/UpdateRequest/UserUpdateRequest';
import {environment} from '../../../environments/environment';
import {ApiResponse} from '../models/Response/api-response';
import {User} from '../models/DTOs/User';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class UserService {
  private baseUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  updateUser(id: string, requestBody: FormData): Observable<ApiResponse<User>> {
    return this.http.patch<ApiResponse<User>>(
      `${this.baseUrl}/user/${id}`,
      requestBody,
      { withCredentials: true }
    );
  }
}
