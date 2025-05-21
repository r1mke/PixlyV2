import {Injectable} from '@angular/core';

import {HttpClient} from '@angular/common/http';
import {RegisterRequest} from '../models/DTOs/Request/RegisterRequest';
import {Observable, tap} from 'rxjs';
import {ApiResponse} from '../models/Response/api-response';
import {RegisterResponse} from '../models/Response/RegisterResponse';
import {TokenService} from './token.service';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = `${environment.apiUrl}/auth`;

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
  ) {}

  register(values: RegisterRequest): Observable<ApiResponse<RegisterResponse>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/register`, values)
      .pipe(
        tap(response => {
          if (response.success && response.data.token) {
            // Store token in memory
            this.tokenService.setToken(response.data.token);
          }
        })
      );
  }
}
