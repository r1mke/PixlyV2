import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import {NavBarComponent} from '../../shared/components/nav-bar/nav-bar.component';
import { GalleryComponent } from "../../shared/components/gallery/gallery.component";
import { HeroComponent } from "../../shared/components/hero/hero.component";
import { DropdownComponent } from "../../shared/components/dropdown/dropdown.component";
import { SearchService } from '../../core/services/search.service';
import { PhotoService } from '../../core/services/photo.service';
import { effect } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs';
import { DropdownValue } from '../../core/models/Dropdown/DropdownValue';

@Component({
  selector: 'app-home',
  imports: [
    NavBarComponent,
    GalleryComponent,
    HeroComponent,
    DropdownComponent
],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  standalone: true
})
export class HomeComponent{
  dropdownPopularity : DropdownValue = {
    mode: 'Popularity',
    value : ["Popular", "New"],
    selectedOption: "Popular"
  };
  searchService = inject(SearchService);
  photoService = inject(PhotoService);
  //private ngOnDestroy$ = new Subject<void>();

  ngOnInit() {
    this.searchService.resetSearch();
  }

  
}
