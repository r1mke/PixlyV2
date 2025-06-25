import { inject, Injectable, signal } from '@angular/core';
import { BehaviorSubject, EMPTY, Observable } from 'rxjs';
import { PhotoSearchRequest } from '../../core/models/SearchRequest/PhotoSarchRequest';
import { List } from 'lodash';
import { HttpClient } from '@angular/common/http';
import { HttpParams } from '@angular/common/http';
import { tap } from 'rxjs';
import { ApiResponse } from '../models/Response/api-response';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  searchObject = new BehaviorSubject<Partial<PhotoSearchRequest>>({
    sorting: 'Popular',
    title: null,
    orientation: null,
    size: null,
    isUserIncluded: true,
    pageNumber: 1,
    pageSize: 10,
  });

  searchSuggestionsTitle = new BehaviorSubject<string>('');
  searchSuggestions = signal<string[]>([]);
  private http = inject(HttpClient);
  private apiUrl = "https://localhost:7136/api/photo";
  getSearchObject(): Partial<PhotoSearchRequest> {
    return this.searchObject.getValue();
  }

  getSearchObjectAsObservable() {
    return this.searchObject.asObservable();
  }

  getSearchSuggestionsTitleAsObservable() {
    return this.searchSuggestionsTitle.asObservable();
  }

  setSearchObject(searchObject: Partial<PhotoSearchRequest>) {
    if(searchObject.size?.includes('All')) searchObject.size = null;
    if(searchObject.orientation?.includes('All')) searchObject.orientation = null;
    searchObject.isUserIncluded = true;

    this.searchObject.next(searchObject);
  }

  setTitle(title: string) {
    this.setSearchObject({
      ...this.getSearchObject(),
      title,
      pageNumber: 1
    });
  }

   setSorting(sorting: string) {
    this.setSearchObject({
      ...this.getSearchObject(),
      sorting,
      pageNumber: 1
    });
  }

  setOrientation(orientation: string) {
    this.setSearchObject({
      ...this.getSearchObject(),
      orientation,
      pageNumber: 1
    });
  }

  setSize(size: string) {
    this.setSearchObject({
      ...this.getSearchObject(),
      size,
      pageNumber: 1
    });
  }

   resetSearch() {
    this.setSearchObject({
      title: null,
      orientation: null,
      size: null,
      pageNumber: 1,
      pageSize: 10,
      sorting: 'Popular'
    });
  }

  getSearchSuggestionsTitle(): string {
    return this.searchSuggestionsTitle.getValue();
  }

  getSearchSuggestions(title : string) : Observable<ApiResponse<string[]>> {
    if(!title) {
      return EMPTY;
    }
    let params = new HttpParams();
    params = params.set('title', title);
    return this.http.get<ApiResponse<string[]>>(`${this.apiUrl}/search-suggestion/${title}`).pipe(
      tap({
      next:
        (response : ApiResponse<string[]>) => {
        if(response.success && response.data) {
          this.searchSuggestions.set(response.data);
        } else{
          this.searchSuggestions.set([]);
        }
      }, error: (err) => {
        console.log(err);
        this.searchSuggestions.set([]);
      }
    })
    );
  }
}





