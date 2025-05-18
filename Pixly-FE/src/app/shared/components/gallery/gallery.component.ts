import { AfterViewInit, Component, ElementRef, inject, ViewChild } from '@angular/core';
import { PhotoBasic } from '../../../models/DTOs/PhotoBasic';
import { PhotoService } from '../../../services/photoService/photo.service';
import { OnInit, Input, OnChanges, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { SimpleChanges } from '@angular/core';
import { PhotoSearchRequest } from '../../../models/SearchRequest/PhotoSarchRequest';
import { RouterModule } from '@angular/router';
import { takeUntil } from 'rxjs';
import { Subject } from 'rxjs';
import { SearchService } from '../../../services/searchService/search.service';
@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.css'
})
export class GalleryComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy{
  @Input() emptyStateMessage: string = 'Nema pronađenih fotografija';
  @ViewChild('sentinel') sentinel!: ElementRef;
  
  private _scrollHandler: (() => void) | null = null;
  private destroy$ = new Subject<void>();
  private intersectionObserver?: IntersectionObserver;
  private subscription?: Subscription;
  searchService = inject(SearchService);
  photoService = inject(PhotoService);
  ngOnInit(): void {
    this.loadPhotos();
  }

   ngOnChanges(changes: SimpleChanges): void {
    if ((changes['photoSearchRequest'] && !changes['photoSearchRequest'].firstChange)
    ) {
      console.log('Search request changed:');
      this.loadPhotos();
    }
  }

  ngAfterViewInit(): void {
    this.setupIntersectionObserver();
  }

  loadPhotos(): void {
    const searchObject = this.searchService.getSearchObject();
    this.subscription = this.photoService.getPhotos(searchObject).subscribe();
  }

  loadMore(): void {
    if (this.photoService.isLoading()) return;
    this.subscription = this.photoService.loadMorePhotos().subscribe();
  }

  trackByPhotoId(index: number, photo: PhotoBasic): string {
    return photo.slug;
  }

  setupIntersectionObserver(): void {
    if (!this.sentinel || !('IntersectionObserver' in window)) {
        console.log('Sentinel element missing or IntersectionObserver not supported');
        this.setupScrollListener();
        return;
      }

    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }

    this.intersectionObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !this.photoService.isLoading()) {
        this.loadMore();
      }
    }, {
      root: null,
      rootMargin: '200px',
      threshold: 0
    });

    this.intersectionObserver.observe(this.sentinel.nativeElement);
  }

  setupScrollListener(): void {
    const handleScroll = () => {
    if (this.photoService.isLoading()) return;
    const scrollPosition = window.scrollY + window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    if (documentHeight - scrollPosition < 200) {
      this.loadMore();
    }
    };
    window.addEventListener('scroll', handleScroll);
    this._scrollHandler = handleScroll;
  }

  getColumnClass(photo: PhotoBasic): string {
    switch (photo.orientation?.toLowerCase()) {
      case 'portrait':
        return 'grid-item-portrait';
      case 'landscape':
        return 'grid-item-landscape';
      case 'square':
        return 'grid-item-square';
      default:
        return 'grid-item-landscape';
    }
  }

  getColumnPhotos(columnIndex: number): PhotoBasic[] {
    return this.photoService.photos()
      .filter((_, index) => index % 3 === columnIndex);
  }

 ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }

    if (this._scrollHandler) {
      window.removeEventListener('scroll', this._scrollHandler);
    }
  }

}


