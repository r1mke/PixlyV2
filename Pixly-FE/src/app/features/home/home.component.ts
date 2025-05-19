import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import {NavBarComponent} from '../../shared/components/nav-bar/nav-bar.component';
import { GalleryComponent } from "../../shared/components/gallery/gallery.component";
import { HeroComponent } from "../../shared/components/hero/hero.component";
import { DropdownPopularityComponent } from "../../shared/components/dropdown-popularity/dropdown-popularity.component";
import { SearchService } from '../../services/searchService/search.service';
import { PhotoService } from '../../services/photoService/photo.service';
import { effect } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs';

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
export class HomeComponent implements OnInit, OnDestroy {
  options: string[] = ["Popular", "New"];
  searchService = inject(SearchService);
  photoService = inject(PhotoService);
  private ngOnDestroy$ = new Subject<void>();

   constructor() {
    effect(() => {
      const searchObj = this.searchService.getSearchObject();
      if (!searchObj.title && searchObj.sorting) {
        this.photoService.getPhotos(searchObj).pipe(takeUntil(this.ngOnDestroy$)).subscribe();
      }
    });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.ngOnDestroy$.next();
    this.ngOnDestroy$.complete();
  }

}
