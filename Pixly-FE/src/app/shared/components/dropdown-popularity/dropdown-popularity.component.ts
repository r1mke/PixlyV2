import { Component, output } from '@angular/core';
import { BsDropdownModule,BsDropdownConfig  } from 'ngx-bootstrap/dropdown';
import { Input } from '@angular/core';
import { OnInit } from '@angular/core';
import { Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
@Component({
  selector: 'app-dropdown-popularity',
  imports: [BsDropdownModule],
  standalone: true,
  templateUrl: './dropdown-popularity.component.html',
  styleUrl: './dropdown-popularity.component.css'
})
export class DropdownPopularityComponent implements OnInit {
   @Input() options: string[] = [];
   selectedOption: string | null = null;
   trending = output<string>();
  ngOnInit() {
    if (this.options.length > 0) {
      this.selectedOption = this.options[0];
    }
  }

  selectTrending(option: string) {
    this.selectedOption = option;
    this.trending.emit(option);
  }

}
