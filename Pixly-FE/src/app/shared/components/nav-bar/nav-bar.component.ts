import { Component} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchService } from '../../../core/services/search.service';
import { inject } from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {TokenService} from '../../../core/services/token.service';
import {AuthService} from '../../../core/services/auth.service';
import {Subscription} from 'rxjs';
@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'],
})

export class NavBarComponent {
  menuOpen : boolean = false;
  isLoggedIn : boolean = false;
  searchService = inject(SearchService);
  router = inject(Router);
  tokenService = inject(TokenService);
  authService = inject(AuthService);

  private tokenSubscription?: Subscription;
  ngOnInit() {
    // Prati stanje tokena
    this.tokenSubscription = this.tokenService.token$.subscribe(token => {
      this.isLoggedIn = !!token;
    });

    // Inicijalno stanje
    this.isLoggedIn = this.tokenService.hasToken();
  }

  ngOnDestroy() {
    if (this.tokenSubscription) {
      this.tokenSubscription.unsubscribe();
    }
  }

   search(event: KeyboardEvent) {
    if(event.key === 'Enter'){
      const searchText = (event.target as HTMLInputElement).value;
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
      let searchObject = this.searchService.getSearchObject();
      searchObject = {
        ...searchObject,
        title: searchText,
        pageNumber: 1,
      };

      this.searchService.setSearchObject(searchObject);

      if (!this.router.url.includes('/search')) {
        this.router.navigate(['/search']);
      }
    }
  }

}
