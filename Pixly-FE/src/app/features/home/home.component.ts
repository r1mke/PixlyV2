import { Component } from '@angular/core';
import {NavBarComponent} from '../../shared/components/nav-bar/nav-bar.component';

@Component({
  selector: 'app-home',
  imports: [
    NavBarComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  standalone: true
})
export class HomeComponent {

}
