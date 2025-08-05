import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs';
import {
  trigger,
  state,
  style,
  transition,
  animate
} from '@angular/animations';

// Components
import { NavBarComponent } from "../../shared/components/nav-bar/nav-bar.component";
import { GalleryComponent } from "../../shared/components/gallery/gallery.component";
import { DropdownComponent } from '../../shared/components/dropdown/dropdown.component';

// Services
import { SearchService } from '../../core/services/search.service';
import { PhotoService } from '../../core/services/photo.service';

// Models
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
export class SearchComponent implements OnInit, OnDestroy {

  // ========== PUBLIC PROPERTIES ==========
  isCollapsed = false;

  // Dropdown configurations
  dropdownPopularity: DropdownValue = {
    mode: 'Popularity',
    value: ["Popular", "New"],
    selectedOption: "Popular"
  };

  moreFilters: DropdownValue = {
    mode: 'More filters',
    value: null,
    selectedOption: "Filters"
  };

  dropdownOrientation: DropdownValue = {
    mode: 'Orientation',
    value: ["All Orientation", "Landscape", "Portrait", "Square"],
    selectedOption: "All Orientation"
  };

  dropdownColors: DropdownValue = {
    mode: 'Colors',
    value: ["All Colors", "Landscape", "Portrait", "Square"],
    selectedOption: "All Colors"
  };

  dropdownSize: DropdownValue = {
    mode: 'Size',
    value: ["All Size", "Large", "Medium", "Small"],
    selectedOption: "All Size"
  };

  // ========== PRIVATE PROPERTIES ==========
  private destroy$ = new Subject<void>();
  private isUpdatingFromUrl = false;

  // ========== INJECTED SERVICES ==========
  searchService = inject(SearchService);
  photoService = inject(PhotoService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  // ========== LIFECYCLE METHODS ==========
  ngOnInit() {
    this.initializeRouteSubscriptions();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ========== INITIALIZATION METHODS ==========
  private initializeRouteSubscriptions() {
    // Subscribe to route parameters
    this.route.paramMap.pipe(
      takeUntil(this.destroy$)
    ).subscribe((params: ParamMap) => {
      this.setParams(params);
    });

    // Subscribe to query parameters
    this.route.queryParamMap.pipe(
      takeUntil(this.destroy$)
    ).subscribe(queryParams => {
      this.setQueryParams(queryParams);
    });
  }

  // ========== ROUTE PARAMETER HANDLING ==========
  setParams(params: ParamMap) {
    const title = params.get('title');
    if (title) {
      this.searchService.setTitle(title);
    } else {
      this.router.navigate(['/'], {
        replaceUrl: true,
        queryParams: {}
      });
    }
  }

  setQueryParams(queryParams: ParamMap) {
    const currentSearch = this.searchService.getSearchObject();
    const updatedSearch: Partial<PhotoSearchRequest> = { ...currentSearch };

    // Handle orientation parameter
    const orientation = queryParams.get('orientation');
    if (orientation) {
      updatedSearch.orientation = orientation;
    }

    // Handle size parameter
    const size = queryParams.get('size');
    if (size) {
      updatedSearch.size = size;
    }

    // Handle sort parameter
    const sort = queryParams.get('sort');
    if (sort) {
      switch (sort.toLowerCase()) {
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

    // Update search object if any parameters were found
    if (orientation || size || sort) {
      this.searchService.setSearchObject(updatedSearch);
    }

    // Subscribe to search object changes for URL updates
    this.searchService.getSearchObjectAsObservable().pipe(
      takeUntil(this.destroy$)
    ).subscribe(searchObject => {
      if (!this.isUpdatingFromUrl) {
        this.updateUrlFromSearchObject(searchObject);
      }
    });
  }

  // ========== URL UPDATE METHODS ==========
  private updateUrlFromSearchObject(searchObject: Partial<PhotoSearchRequest>) {
    this.isUpdatingFromUrl = true;

    const queryParams: any = {};

    // Map orientation to query parameter
    if (searchObject.orientation) {
      queryParams.orientation = searchObject.orientation.toLowerCase();
    }

    // Map size to query parameter
    if (searchObject.size) {
      queryParams.size = searchObject.size.toLowerCase();
    }

    // Map sorting to query parameter
    if (searchObject.sorting) {
      switch (searchObject.sorting) {
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

    // Navigate with updated query parameters
    this.router.navigate(
      ['/search', searchObject.title || ''],
      {
        queryParams,
        replaceUrl: true
      }
    ).then(() => {
      this.isUpdatingFromUrl = false;
    });
  }

  // ========== UI INTERACTION METHODS ==========
  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
  }
}