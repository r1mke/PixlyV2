import { Component } from '@angular/core';
import { NavBarComponent } from "../../shared/components/nav-bar/nav-bar.component";
import { GalleryComponent } from "../../shared/components/gallery/gallery.component";
import { SearchService } from '../../core/services/search.service';
import { PhotoService } from '../../core/services/photo.service';
import { ActivatedRoute } from '@angular/router';
import { OnInit } from '@angular/core';
import { inject } from '@angular/core';
import { ParamMap } from '@angular/router';
import { takeUntil } from 'rxjs';
import { Subject } from 'rxjs';
import {
  trigger,
  state,
  style,
  transition,
  animate
} from '@angular/animations';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DropdownComponent } from '../../shared/components/dropdown/dropdown.component';
import { DropdownValue } from '../../core/models/Dropdown/DropdownValue';
import { PhotoSearchRequest } from '../../core/models/SearchRequest/PhotoSarchRequest';
@Component({
  selector: 'app-search',
  imports: [NavBarComponent, GalleryComponent, DropdownComponent, CommonModule],
  standalone: true,
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
  animations: [
    trigger('collapseAnimation', [
      transition(':enter', [
        style({ height: '0', opacity: 0 }),
        animate('500ms ease-out', style({ height: '*', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('500ms ease-in', style({ height: '0', opacity: 0 }))
      ])
    ])
  ]
})

export class SearchComponent implements OnInit {
  searchService = inject(SearchService);
  photoService = inject(PhotoService);
  route = inject(ActivatedRoute);
  private destroy$ = new Subject<void>();
  private isUpdatingFromUrl = false;
  router = inject(Router);
  isCollapsed = false;
  dropdownPopularity : DropdownValue = {
      mode: 'Popularity',
      value : ["Popular", "New"],
      selectedOption: "Popular"
  };
  moreFilters : DropdownValue = {
    mode: 'More filters',
    value : null,
    selectedOption: "Filters"
  }
  dropdownOrientation : DropdownValue = {
      mode: 'Orientation',
      value : ["All Orientation","Landscape", "Portrait", "Square"],
      selectedOption: "All Orientation"
  };
  dropdownSize : DropdownValue = {
      mode: 'Size',
      value : ["All Size","Large", "Medium", "Small"],
      selectedOption: "All Size"
  };

  ngOnInit() {
    this.route.paramMap.pipe(
      takeUntil(this.destroy$)
    ).subscribe((params: ParamMap) => {
      this.setParams(params);
    });

    this.route.queryParamMap.pipe(
      takeUntil(this.destroy$)
    ).subscribe(queryParams => {
      console.log('queryParams', queryParams);
      this.setQueryParams(queryParams);
  });
  }


  setParams(params:ParamMap){
    const title = params.get('title');
      if (title) {
       this.searchService.setTitle(title);
      }
      else {
       this.router.navigate(['/'], { 
          replaceUrl: true,
          queryParamsHandling: 'merge'
        });
      }
  }

  setQueryParams(queryParams: ParamMap)
  {
    const currentSearch = this.searchService.getSearchObject();
    const updatedSearch: Partial<PhotoSearchRequest> = { ...currentSearch };

      const orientation = queryParams.get('orientation');
      if (orientation) {
        updatedSearch.orientation = orientation;
      }

      const size = queryParams.get('size');
      if (size) {
        updatedSearch.size = size;
      }

      const sort = queryParams.get('sort');
      if (sort) {
        switch(sort.toLowerCase()) {
          case 'popular':
          case 'desc':
            updatedSearch.sorting = 'Popular';
            break;
          case 'newest':
          case 'asc':
            updatedSearch.sorting = 'New';
            break;
          default:
            updatedSearch.sorting = sort;
            break;
        }
      }

      if (orientation || size || sort) {
        this.searchService.setSearchObject(updatedSearch);
      }

      this.searchService.getSearchObjectAsObservable().pipe(
        takeUntil(this.destroy$)
      ).subscribe(searchObject => {
       
        if (!this.isUpdatingFromUrl) {
          this.updateUrlFromSearchObject(searchObject);
        }
      });

  };
  

   private updateUrlFromSearchObject(searchObject: Partial<PhotoSearchRequest>) {
    this.isUpdatingFromUrl = true;
    
    const queryParams: any = {};
    
    // Add filters to query params
    if (searchObject.orientation) {
      queryParams.orientation = searchObject.orientation.toLowerCase();
    }
    
    if (searchObject.size) {
      queryParams.size = searchObject.size.toLowerCase();
    }
    
     if (searchObject.sorting) {
      // Convert sorting parameters to match Pexels format
      switch(searchObject.sorting) {
        case 'Popular':
          queryParams.sort = 'popular';
          break;
        case 'New':
          queryParams.sort = 'newest';
          break;
        default:
          queryParams.sort = searchObject.sorting.toLowerCase();
          break;
      }
    }
    
    // Navigate with the updated URL
    this.router.navigate(
      ['/search', searchObject.title || ''], 
      { 
        queryParams,
        replaceUrl: true // Use replaceUrl to avoid creating multiple history entries
      }
    ).then(() => {
      this.isUpdatingFromUrl = false;
    });
  }

  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
