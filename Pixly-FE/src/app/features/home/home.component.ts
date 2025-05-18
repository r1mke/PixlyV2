import { Component, inject } from '@angular/core';
import {NavBarComponent} from '../../shared/components/nav-bar/nav-bar.component';
import { GalleryComponent } from "../../shared/components/gallery/gallery.component";
import { HeroComponent } from "../../shared/components/hero/hero.component";
import { DropdownPopularityComponent } from "../../shared/components/dropdown-popularity/dropdown-popularity.component";
import { SearchService } from '../../services/searchService/search.service';
import { PhotoService } from '../../services/photoService/photo.service';
import { effect } from '@angular/core';
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
  searchService = inject(SearchService);
  photoService = inject(PhotoService);

   constructor() {
  
    effect(() => {
      const searchObj = this.searchService.getSearchObject();
      
      if (!searchObj.title && searchObj.sorting) {
        console.log('Sorting changed on home, reloading photos:', searchObj);
        this.photoService.getPhotos(searchObj).subscribe();
      }
    });
  }

  ngOnInit() {
   
    this.searchService.setSearchObject({
      sorting: "Popular",
      title: null,
      pageNumber: 1,
      pageSize: 10
    });
  }

}
