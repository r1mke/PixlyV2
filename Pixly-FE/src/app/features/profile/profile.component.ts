import { Component } from '@angular/core';
import { GalleryComponent } from "../../shared/components/gallery/gallery.component";
import { PhotoSearchRequest } from '../../models/SearchRequest/PhotoSarchRequest';
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [GalleryComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {

}
