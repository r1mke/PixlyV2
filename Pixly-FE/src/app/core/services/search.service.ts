import { Injectable, signal } from '@angular/core';
import { PhotoSearchRequest } from '../models/SearchRequest/PhotoSarchRequest';
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
      pageNumber: 1,
      pageSize: 10,
      sorting: 'Popular'
    });
  }

}
