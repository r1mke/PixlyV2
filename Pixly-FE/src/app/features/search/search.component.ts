import { Component } from '@angular/core';
import { NavBarComponent } from "../../shared/components/nav-bar/nav-bar.component";
import { GalleryComponent } from "../../shared/components/gallery/gallery.component";
import { SearchService } from '../../core/services/search.service';
import { PhotoService } from '../../core/services/photo.service';
import { ActivatedRoute } from '@angular/router';
import { OnInit } from '@angular/core';
import { inject } from '@angular/core';
import { effect } from '@angular/core';
@Component({
  selector: 'app-search',
  imports: [NavBarComponent, GalleryComponent],
  standalone: true,
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent implements OnInit {
  searchService = inject(SearchService);
  photoService = inject(PhotoService);
  route = inject(ActivatedRoute);

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['q']) {
        console.log('Query parameter q:', params['q']);
        this.searchService.setTitle(params['q']);
      }
    });
  }

}
