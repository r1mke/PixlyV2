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

import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ViewChild } from '@angular/core';
import { ElementRef } from '@angular/core';
@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'],
})

export class NavBarComponent implements OnInit {
  @ViewChild('searchInput') searchInput!: ElementRef;
  menuOpen : boolean = false;
  isLoggedIn : boolean = true;
  searchService = inject(SearchService);
  router = inject(Router);
  sanitizer = inject(DomSanitizer);
  isSearchFocused: boolean = false;
  currentSearchText: string = '';
  private onDestroy$ = new Subject<void>();

  ngOnInit() {
    this.searchService.getSearchSuggestionsTitleAsObservable().pipe(
          takeUntil(this.onDestroy$),
          distinctUntilChanged((prev, curr) => isEqual(prev, curr)),
          debounceTime(300)
          ).subscribe((title: string) => {
          if (title.trim().length > 0) {
            this.searchService.getSearchSuggestions(title).subscribe();
          } else {
            this.searchService.searchSuggestions.set([]);
          }
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
      this.searchService.searchSuggestions.set([]);
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
    this.currentSearchText = searchText;
    if (searchText.trim().length > 0) {
      console.log('Search text:', searchText);
      this.searchService.searchSuggestionsTitle.next(searchText);
    }  else {
       this.searchService.searchSuggestions.set([]);
    }
  }

   useSuggestion(suggestion: string) {
    const inputElement = document.querySelector('.search-bar input') as HTMLInputElement;
    if (inputElement) {
      inputElement.value = suggestion;
      this.performSearch(suggestion);
    }
  }

  highlightMatches(suggestion: string, query: string): SafeHtml {
    // Koristite trenutnu vrijednost pretrage umjesto reference na input
    const searchQuery = query || this.currentSearchText;
    
    if (!searchQuery || searchQuery.trim() === '') {
      return this.sanitizer.bypassSecurityTrustHtml(suggestion);
    }
    
    const lowerSuggestion = suggestion.toLowerCase();
    const lowerQuery = searchQuery.toLowerCase();
    
    // Ostatak funkcije ostaje isti
    if (lowerSuggestion.startsWith(lowerQuery)) {
      const matchPart = suggestion.substring(0, searchQuery.length);
      const restPart = suggestion.substring(searchQuery.length);
      
      return this.sanitizer.bypassSecurityTrustHtml(
        `<span class="match">${matchPart}</span><span class="rest">${restPart}</span>`
      );
    } else if (lowerSuggestion.includes(lowerQuery)) {
      const index = lowerSuggestion.indexOf(lowerQuery);
      const before = suggestion.substring(0, index);
      const match = suggestion.substring(index, index + searchQuery.length);
      const after = suggestion.substring(index + searchQuery.length);
      
      return this.sanitizer.bypassSecurityTrustHtml(
        `${before}<span class="match">${match}</span><span class="rest">${after}</span>`
      );
    } else {
      return this.sanitizer.bypassSecurityTrustHtml(suggestion);
    }
  }

   onSearchFocus() {
    this.isSearchFocused = true;
    const inputElement = document.querySelector('.search-bar input') as HTMLInputElement;
    if (inputElement && inputElement.value.trim().length > 0) {
      this.searchService.searchSuggestionsTitle.next(inputElement.value);
    }
  }

  onSearchBlur() {
    setTimeout(() => {
      this.isSearchFocused = false;
    }, 200);
  }

  goToHome() {
    this.searchService.searchSuggestions.set([]);
    this.router.navigate(['/']);
  }

}
