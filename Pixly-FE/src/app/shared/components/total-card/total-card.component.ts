import { Component } from '@angular/core';
import { Input } from '@angular/core';
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

  get formattedValue(): string {
    if (typeof this.value === 'number') {
      return this.value.toLocaleString();
    }
    return this.value.toString();
  }
}
