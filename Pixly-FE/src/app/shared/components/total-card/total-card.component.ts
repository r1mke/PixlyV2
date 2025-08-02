import { Component } from '@angular/core';
import { Input } from '@angular/core';
import tinycolor from 'tinycolor2';
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

  getGradient(startColor: string): string {
    const endColor = tinycolor(startColor).darken(15).toHexString(); // generiše hover efekat
    return `linear-gradient(135deg, ${startColor} 0%, ${endColor} 100%)`;
  }
}
