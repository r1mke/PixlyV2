import { Component } from '@angular/core';
import { NavBarComponent } from "../../shared/components/nav-bar/nav-bar.component";
import { GalleryComponent } from "../../shared/components/gallery/gallery.component";
import { PhotoSearchRequest } from "../../models/SearchRequest/PhotoSarchRequest";
@Component({
  selector: 'app-search',
  imports: [NavBarComponent, GalleryComponent],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {
  searchRequest: Partial<PhotoSearchRequest> = {
    title: 'test',
    pageSize: 10,
    pageNumber: 1,
  };

  constructor() { }

}
