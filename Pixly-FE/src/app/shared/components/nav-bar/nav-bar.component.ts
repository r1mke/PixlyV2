import { Component} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchService } from '../../../core/services/search.service';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { OnInit } from '@angular/core';
import { debounceTime, takeUntil } from 'rxjs';
import { Subject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs';
import isEqual from 'lodash.isequal';
@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'],
})

export class NavBarComponent implements OnInit {
  menuOpen : boolean = false;
  isLoggedIn : boolean = true;
  searchService = inject(SearchService);
  router = inject(Router);
  curerntSearchText: string = '';
  private onDestroy$ = new Subject<void>();

  ngOnInit() {
    this.searchService.getSearchSuggestionsTitleAsObservable().pipe(
          takeUntil(this.onDestroy$),
          distinctUntilChanged((prev, curr) => isEqual(prev, curr)),
          debounceTime(400)
          ).subscribe((title: string) => {
            console.log("poziv");
          this.searchService.getSearchSuggestions(title).subscribe();
        });
  }

  search(event: KeyboardEvent) {
    if(event.key === 'Enter'){
      const searchText = (event.target as HTMLInputElement).value;
       if ((!searchText || searchText.trim().length === 0) && this.router.url.includes('/search')) {
        this.router.navigate(['/'], { queryParams: {} });
        return;
      }
      this.performSearch(searchText);
    }
  }

  searchByClick() {
    const inputElement = document.querySelector('.search-bar input') as HTMLInputElement;
    const searchText = inputElement?.value || '';
    if ((!searchText || searchText.trim().length === 0) && this.router.url.includes('/search')) {
      this.router.navigate(['/'], { queryParams: {} });
      return;
    }
    
    if (inputElement && inputElement.value.trim().length > 0) {
      this.performSearch(inputElement.value);
    }
  }

  performSearch(searchText: string) {
    if (searchText.trim().length > 0) {
      let searchObject = this.searchService.getSearchObject();
      searchObject = {
        ...searchObject,
        title: searchText,
        pageNumber: 1,
      };

      this.searchService.setSearchObject(searchObject);

      if (!this.router.url.includes('/search')) {
        this.router.navigate(['/search', searchText]);
      } else {
          this.router.navigate(['/search', searchText], {
          queryParamsHandling: 'merge' 
        });
      }
    }
  }

  getSearchSuggestions(event : KeyboardEvent) {
    const inputElement = event.target as HTMLInputElement;
    const searchText = inputElement.value;
    if (searchText.trim().length > 0) {
      console.log('Search text:', searchText);
      this.searchService.searchSuggestionsTitle.next(searchText);
    } 
  }

  goToHome() {
    this.router.navigate(['/']);
  }

}
