import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, EMPTY, Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PaginationHeader } from '../models/Pagination/PaginationHeader';
import { ApiResponse } from '../models/Response/api-response';

export interface PaginationConfig<T, S> {
  baseUrl: string;
  initialSearchRequest?: Partial<S>;
  pageSize?: number;
}

@Injectable({
  providedIn: 'root'
})
export class PaginationService<T, S = any>  {

  private _items = signal<T[]>([]);
  private _paginationHeader = signal<PaginationHeader | null>(null);
  private _isLoading = signal<boolean>(false);
  private _error = signal<string | null>(null);

  constructor(private http: HttpClient) {}

  private currentSearchRequest = new BehaviorSubject<Partial<S>>({});
  
  // Public getters
  get items() { return this._items.asReadonly(); }
  get paginationHeader() { return this._paginationHeader.asReadonly(); }
  get isLoading() { return this._isLoading.asReadonly(); }
  get error() { return this._error.asReadonly(); }
  
  initialize(config: PaginationConfig<T, S>): void {
    if (config.initialSearchRequest) {
      const initialRequest = {
        pageNumber: 1,
        pageSize: config.pageSize || 10,
        ...config.initialSearchRequest
      };
      this.currentSearchRequest.next(initialRequest);
    }
  }

   getItems(
    baseUrl: string, 
    searchRequest: Partial<S>
  ): Observable<HttpResponse<ApiResponse<T[]>>> {
    this.currentSearchRequest.next(searchRequest);
    this._isLoading.set(true);

    // Reset items if it's first page
    if ((searchRequest as any).pageNumber === 1) {
      this._items.set([]);
    }

    let params = new HttpParams();
    Object.entries(searchRequest).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params = params.set(key, value.toString());
      }
    });

    return this.http.get<ApiResponse<T[]>>(baseUrl, { 
      observe: 'response', 
      params 
    }).pipe(
      tap({
        
        next: (response: any) => this.handleSuccessResponse(response, searchRequest),
        error: (err) => this.handleErrorResponse(err)
      })
    );
  }

   loadMore(baseUrl: string): Observable<HttpResponse<ApiResponse<T[]>>> {
    if (this._isLoading()) {
      return EMPTY;
    }

    const currentPage = this._paginationHeader()?.currentPage || 0;
    const nextPage = currentPage + 1;
    const totalPages = this._paginationHeader()?.totalPages || 0;

    if (nextPage > totalPages) {
      return EMPTY;
    }

    const currentRequest = this.currentSearchRequest.getValue();
    return this.getItems(baseUrl, {
      ...currentRequest,
      pageNumber: nextPage
    } as Partial<S>);
  }

  refresh(baseUrl: string): Observable<HttpResponse<ApiResponse<T[]>>> {
    const currentRequest = this.currentSearchRequest.getValue();
    return this.getItems(baseUrl, {
      ...currentRequest,
      pageNumber: 1
    } as Partial<S>);
  }

  updateSearch(
    baseUrl: string, 
    searchUpdates: Partial<S>
  ): Observable<HttpResponse<ApiResponse<T[]>>> {
    const currentRequest = this.currentSearchRequest.getValue();
    const newRequest = {
      ...currentRequest,
      ...searchUpdates,
      pageNumber: 1 // Reset to first page on new search
    };
    
    return this.getItems(baseUrl, newRequest);
  }

   addItem(item: T): void {
    this._items.update(items => [item, ...items]);
  }

  removeItem(predicate: (item: T) => boolean): void {
    this._items.update(items => items.filter(item => !predicate(item)));
  }

  updateItem(predicate: (item: T) => boolean, updater: (item: T) => T): void {
    this._items.update(items => 
      items.map(item => predicate(item) ? updater(item) : item)
    );
  }

  clear(): void {
    this._items.set([]);
    this._paginationHeader.set(null);
    this._error.set(null);
  }

  getCurrentSearchRequest(): Partial<S> {
    return this.currentSearchRequest.getValue();
  }

  getCurrentSearchRequest$(): Observable<Partial<S>> {
    return this.currentSearchRequest.asObservable();
  }

  private handleSuccessResponse(
    response: HttpResponse<ApiResponse<T[]>>, 
    searchRequest: Partial<S>
  ): void {
    if (response.body?.success && response.body?.data) {
      const isFirstPage = (searchRequest as any).pageNumber === 1;
      
      if (isFirstPage) {
        this._items.set(response.body.data);
      } else {
        this._items.update(prevItems => [...prevItems, ...response.body!.data]);
      }

      const paginationHeader = this.getPaginationFromResponse(response);
      if (paginationHeader) {
        this._paginationHeader.set(paginationHeader);
      }
    }
    
    this._isLoading.set(false);
    this._error.set(null);
  }

  private handleErrorResponse(error: any): void {
    this._isLoading.set(false);
    this._error.set(error.message || 'An error occurred');
  }

  private getPaginationFromResponse(response: HttpResponse<any>): PaginationHeader | null {
    const paginationHeader = response.headers.get('Pagination');
    return paginationHeader ? JSON.parse(paginationHeader) : null;
  }
}
