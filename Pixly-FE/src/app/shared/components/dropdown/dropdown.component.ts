import { Component } from '@angular/core';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { Input } from '@angular/core';
import { OnInit } from '@angular/core';
import { SearchService } from '../../../core/services/search.service';
import { inject } from '@angular/core';
import { DropdownValue } from '../../../core/models/Dropdown/DropdownValue';
import { CommonModule } from '@angular/common';
import { output } from '@angular/core';
@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [BsDropdownModule, CommonModule],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.css'
})
export class DropdownComponent implements OnInit {
   @Input() options: DropdownValue | null = null;
   selectedValue = output<string>();
   searchService = inject(SearchService);

  ngOnInit() {
    
  }


  selectTrending(option: string) {
    this.selectedValue.emit(option);

    if (this.options && option !== this.options.selectedOption) {

      this.options.selectedOption = option;

      if (this.options.mode === 'Popularity') {
        this.searchService.setSorting(option);
      }

      if (this.options.mode === 'Orientation' ) {
        this.searchService.setOrientation(option);
      }

      if (this.options.mode === 'Size') {
        this.searchService.setSize(option);
      }
    }
  }

}
