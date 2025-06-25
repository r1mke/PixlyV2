import {  Component, OnDestroy, ViewChild, ElementRef , OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchService } from '../../../core/services/search.service';
import { inject } from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {AuthState} from '../../../core/state/auth.state';
import {AuthService} from '../../../core/services/auth.service';
import {Subscription} from 'rxjs';
import {User} from '../../../core/models/DTOs/User';
import { debounceTime, takeUntil, distinctUntilChanged } from 'rxjs';
import { Subject } from 'rxjs';
import isEqual from 'lodash.isequal';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit, OnDestroy {
  
  // ========== VIEW CHILD ==========
  @ViewChild('searchInput') searchInput!: ElementRef;
  
  // ========== PUBLIC PROPERTIES ==========
  menuOpen: boolean = false;
  isLoggedIn: boolean = true;
  currentSearchText: string = '';
  isSuggesionsVisible: boolean = false;
  currentUser: User | null = null;
  
  // ========== PRIVATE PROPERTIES ==========
  private subscription = new Subscription();
  private onDestroy$ = new Subject<void>();
  
  // ========== INJECTED SERVICES ==========
  searchService = inject(SearchService);
  router = inject(Router);
  authState = inject(AuthState);
  authService = inject(AuthService);
  sanitizer = inject(DomSanitizer);

  // ========== LIFECYCLE METHODS ==========
  ngOnInit() {
    this.initializeSearchSuggestions();
    this.initializeCurrentSearchText();
    this.initializeAuthSubscriptions();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  // ========== INITIALIZATION METHODS ==========
  private initializeSearchSuggestions() {
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

  private initializeCurrentSearchText() {
    if (this.searchService.getSearchObject().title) {
      this.currentSearchText = this.searchService.getSearchObject().title ?? '';
    }
  }

  private initializeAuthSubscriptions() {
    this.subscription.add(
      this.authState.isLoggedIn$.subscribe(
        isLoggedIn => this.isLoggedIn = isLoggedIn
      )
    );

    this.subscription.add(
      this.authState.currentUser$.subscribe(
        user => this.currentUser = user
      )
    );
  }

  // ========== SEARCH FUNCTIONALITY ==========
  searchFocused(event: FocusEvent) {
    this.isSuggesionsVisible = true;
  }

  searchBlured(event: FocusEvent) {
    this.isSuggesionsVisible = false;
  }

  search(event: KeyboardEvent) {
    if  (event.key === 'Enter')  {
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
    if (inputElement && inputElement.value.trim().length > 0) {
      this.performSearch(inputElement.value);
    }
  }

  performSearch(searchText: string) {
    if (searchText.trim().length > 0) {
      this.searchService.searchSuggestions.set([]);

      if (this.router.url.includes('/search')) {
        let searchObject = this.searchService.getSearchObject();
        searchObject = {
          ...searchObject,
          title: searchText,
          pageNumber: 1,
        };
        this.searchService.setSearchObject(searchObject);

        this.router.navigate(['/search', searchText], {
          queryParamsHandling: 'merge',
          replaceUrl: true
        });
      } else {
        this.router.navigate(['/search', searchText]);
      }
    }
  }

  getSearchSuggestions(event: KeyboardEvent) {
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

  // ========== NAVIGATION METHODS ==========
  goToHome() {
    this.searchService.searchSuggestions.set([]);
    this.router.navigate(['/']);;
  }

  logout() {
    this.authService.logout().subscribe(() => {
      window.location.href = '/';
    });
  }

  // ========== UTILITY METHODS ==========
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