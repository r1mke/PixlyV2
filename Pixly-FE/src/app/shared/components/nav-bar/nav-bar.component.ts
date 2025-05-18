import { Component} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchService } from '../../../services/searchService/search.service';
import { inject } from '@angular/core';
import { Key } from 'readline';
@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'],
})

export class NavBarComponent {
  menuOpen : boolean = false;
  isLoggedIn : boolean = false;
  searchService = inject(SearchService);  

  search(event: KeyboardEvent) {
    let searchObject = this.searchService.getSearchObject();
    if(event.key === 'Enter'){
      searchObject = {
        ...searchObject,
        title: (event.target as HTMLInputElement).value,
      }
      this.searchService.setSearchObject(searchObject);
    }
  }

  searchByClick() {
    let searchObject = this.searchService.getSearchObject();
    const inputElement = document.querySelector('.search-bar input') as HTMLInputElement;
      if (inputElement.value.length > 0) {
        searchObject = {
        ...searchObject,
        title: inputElement.value,
      }
      this.searchService.setSearchObject(searchObject);
      }
  }

}
