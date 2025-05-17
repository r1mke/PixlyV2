import { Component } from '@angular/core';
import { GalleryComponent } from "../../shared/components/gallery/gallery.component";
import { PhotoSearchRequest } from '../../models/SearchRequest/PhotoSarchRequest';
@Component({
  selector: 'app-profile',
  imports: [GalleryComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
searchRequest : PhotoSearchRequest = {
    username: null,
    title: null,
    orientation: null,
    size: null,
    isUserIncluded: null,
    sorting: "Popular",
    isLiked: null,
    isSaved: null,
    pageNumber: 1,
    pageSize: 10
  };
}
