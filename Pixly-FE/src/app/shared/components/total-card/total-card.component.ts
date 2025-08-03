import { Component } from '@angular/core';
import { Input } from '@angular/core';
import { HelperService } from '../../../core/services/helper.service';
import { inject } from '@angular/core';
@Component({
  selector: 'app-total-card',
  standalone: true,
  imports: [],
  templateUrl: './total-card.component.html',
  styleUrl: './total-card.component.css'
})
export class TotalCardComponent {
  @Input() title: string = 'Total Users';
  @Input() value: number | string = 235;
  @Input() icon: string = 'fa-chart-bar';
  @Input() backGroundColor: string = '#02A388';
  helperService = inject(HelperService);
  // #02A388 --> green
  // #FF5733 --> red
  // #3498DB --> blue
  // #F1C40F --> yellow

  get formattedValue(): string {
    if (typeof this.value === 'number') {
      return this.value.toLocaleString();
    }
    return this.value.toString();
  }

}
