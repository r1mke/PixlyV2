import { Component} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchService } from '../../../core/services/search.service';
import { inject } from '@angular/core';
import {Router, RouterLink} from '@angular/router';
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
