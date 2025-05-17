import { Component } from '@angular/core';
import {NavBarComponent} from '../../shared/components/nav-bar/nav-bar.component';
import { GalleryComponent } from "../../shared/components/gallery/gallery.component";
import { PhotoSearchRequest } from '../../models/SearchRequest/PhotoSarchRequest';
import { HeroComponent } from "../../shared/components/hero/hero.component";
import { DropdownPopularityComponent } from "../../shared/components/dropdown-popularity/dropdown-popularity.component";
@Component({
  selector: 'app-home',
  imports: [
    NavBarComponent,
    GalleryComponent,
    HeroComponent,
    DropdownPopularityComponent
],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  standalone: true
})
export class HomeComponent {
  options: string[] = ["Trending", "New"];

   searchRequest : PhotoSearchRequest = {
    username: null,
    title: null,
    orientation: null,
    size: null,
    isUserIncluded: null,
    sorting: null,
    isLiked: null,
    isSaved: null,
    pageNumber: 1,
    pageSize: 10
  };
}
