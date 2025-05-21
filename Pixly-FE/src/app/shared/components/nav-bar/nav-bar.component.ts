import { Component} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchService } from '../../../core/services/search.service';
import { inject } from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {AuthState} from '../../../core/state/auth.state';
import {AuthService} from '../../../core/services/auth.service';
import {Subscription} from 'rxjs';
import {User} from '../../../core/models/DTOs/User';
@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'],
})

export class NavBarComponent {
  menuOpen : boolean = false;
  isLoggedIn : boolean = true;
  searchService = inject(SearchService);
  router = inject(Router);
  authState = inject(AuthState);
  authService = inject(AuthService);

  currentUser: User | null = null;
  private subscription = new Subscription();

  ngOnInit() {
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

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  logout() {
    this.authService.logout().subscribe(() => {
      window.location.href = '/';
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

  goToHome() {
    this.router.navigate(['/'])
  }
}
