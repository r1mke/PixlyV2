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
  options: string[] = ["Popular", "New"];
   searchRequest : Partial<PhotoSearchRequest> = {
    pageNumber: 1,
    pageSize: 10
  };

  onTrendingSelected(sorting: string) {
    this.searchRequest = {
      ...this.searchRequest,
      sorting: sorting
    }
    console.log("updating search request", this.searchRequest);
  }

}
