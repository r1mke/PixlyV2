import { Component, output } from '@angular/core';
import { BsDropdownModule,BsDropdownConfig  } from 'ngx-bootstrap/dropdown';
import { Input } from '@angular/core';
import { OnInit } from '@angular/core';
import { SearchService } from '../../../services/searchService/search.service';
import { inject } from '@angular/core';
@Component({
  selector: 'app-dropdown-popularity',
  imports: [BsDropdownModule],
  standalone: true,
  templateUrl: './dropdown-popularity.component.html',
  styleUrl: './dropdown-popularity.component.css'
})
export class DropdownPopularityComponent implements OnInit {
   @Input() options: string[] = [];
   searchService = inject(SearchService);
   selectedOption: string | null = null;

  ngOnInit() {
    if (this.options.length > 0) {
      this.selectedOption = this.options[0];
    }
  }

  selectTrending(option: string) {
    this.selectedOption = option;
    let searchRequest = this.searchService.getSearchObject();
    if(searchRequest.sorting !== option) {
      searchRequest = {
        ...searchRequest,
        sorting: option
      }
      this.searchService.setSearchObject(searchRequest);
    }
  }

}
