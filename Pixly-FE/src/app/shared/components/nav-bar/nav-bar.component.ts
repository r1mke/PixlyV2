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
import { HostListener } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ViewChild } from '@angular/core';
import { ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
  
})

export class NavBarComponent implements OnInit {
  @ViewChild('searchInput') searchInput!: ElementRef;
  menuOpen : boolean = false;
  isLoggedIn : boolean = true;
  searchService = inject(SearchService);
  router = inject(Router);
  sanitizer = inject(DomSanitizer);
  currentSearchText: string = '';
  private onDestroy$ = new Subject<void>();
  isSuggesionsVisible: boolean = false;
  ngOnInit() {
    this.searchService.getSearchSuggestionsTitleAsObservable().pipe(
          takeUntil(this.onDestroy$),
          distinctUntilChanged((prev, curr) => isEqual(prev, curr)),
          debounceTime(300)
          ).subscribe((title: string) => {
          if (title.trim().length > 0) {
            console.log("pozivam", title);
            console.log(this.searchService.searchSuggestions());
            this.searchService.getSearchSuggestions(title).subscribe();
          } else {
            console.log("cistim");
            this.searchService.searchSuggestions.set([]);
          }
        });

        if(this.searchService.getSearchObject().title) {
          this.currentSearchText = this.searchService.getSearchObject().title ?? '';
        }
  }

  searchFocused(event: FocusEvent) {
    this.isSuggesionsVisible = true;  
  }

  searchBlured(event: FocusEvent) {
    this.isSuggesionsVisible = false;
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
    if(searchText === '')
    {
        this.isSuggesionsVisible = false;
        this.searchService.searchSuggestions.set([]);
        this.searchService.searchSuggestionsTitle.next('');
        console.log(this.currentSearchText, this.searchService.searchSuggestions());
    }
    else{
      this.searchService.searchSuggestionsTitle.next(searchText);
      this.isSuggesionsVisible = true;
    }
  }

   useSuggestion(suggestion: string) {
    const inputElement = document.querySelector('.search-bar input') as HTMLInputElement;
    if (inputElement) {
      inputElement.value = suggestion;
      this.performSearch(suggestion);
    }
  }

  goToHome() {
    this.searchService.searchSuggestions.set([]);
    this.router.navigate(['/']);
  }

  highlightMatches(suggestion: string): SafeHtml {
  // Ako nema teksta za pretragu, vrati originalni suggestion
  if (!this.currentSearchText || this.currentSearchText.trim() === '') {
    return this.sanitizer.bypassSecurityTrustHtml(suggestion);
  }
  
  const searchText = this.currentSearchText.toLowerCase();
  const lowerSuggestion = suggestion.toLowerCase();
  
  // Provjeri sadrži li suggestion tekst za pretragu
  if (lowerSuggestion.includes(searchText)) {
    // Pronađi početni indeks podudaranja
    const index = lowerSuggestion.indexOf(searchText);
    
    // Podijeli suggestion na tri dijela: prije podudaranja, podudaranje, poslije podudaranja
    const beforeMatch = suggestion.substring(0, index);
    const match = suggestion.substring(index, index + searchText.length);
    const afterMatch = suggestion.substring(index + searchText.length);
    
    // Vrati HTML s podebljenim podudaranjem
    return this.sanitizer.bypassSecurityTrustHtml(
      `${beforeMatch}<strong>${match}</strong>${afterMatch}`
    );
  }
  
  // Ako nema podudaranja, vrati originalni suggestion
  return this.sanitizer.bypassSecurityTrustHtml(suggestion);
}

}
