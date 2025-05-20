import { Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PhotoSearchRequest } from '../../core/models/SearchRequest/PhotoSarchRequest';
@Injectable({
  providedIn: 'root'
})
export class SearchService {
  searchObject = new BehaviorSubject<Partial<PhotoSearchRequest>>({
    sorting: 'Popular',
    title: null,
    pageNumber: 1,
    pageSize: 10,
  })

  getSearchObject(): Partial<PhotoSearchRequest> {
    return this.searchObject.getValue();
  }

  getSearchObjectAsObservable() {
    return this.searchObject.asObservable();
  }

  setSearchObject(searchObject: Partial<PhotoSearchRequest>) {
    console.log('Search object set:', searchObject);
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

  resetSearch() {
    this.setSearchObject({
      title: null,
      pageNumber: 1,
      pageSize: 10,
      sorting: 'Popular'
    });
  }

}
