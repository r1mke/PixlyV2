import { Injectable, signal } from '@angular/core';
import { PhotoSearchRequest } from '../../models/SearchRequest/PhotoSarchRequest';
@Injectable({
  providedIn: 'root'
})
export class SearchService {
  searchObject = signal<Partial<PhotoSearchRequest>>({
    pageNumber: 1,
    pageSize: 10,
  })

  getSearchObject(): Partial<PhotoSearchRequest> {
    return this.searchObject();
  }

  setSearchObject(searchObject: Partial<PhotoSearchRequest>) {
    this.searchObject.set(searchObject);
  }

  performSearch() {

  }

}
