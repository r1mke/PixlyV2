import { Component } from '@angular/core';
import { CollapseDirective } from 'ngx-bootstrap/collapse';
@Component({
  selector: 'app-toggle-collapse',
  standalone: true,
  imports: [CollapseDirective],
  templateUrl: './toggle-collapse.component.html',
  styleUrl: './toggle-collapse.component.css'
})
export class ToggleCollapseComponent {
  isCollapsed = false;
}
