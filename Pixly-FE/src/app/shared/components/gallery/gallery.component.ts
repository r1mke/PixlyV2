import { AfterViewInit, Component, ElementRef, inject, ViewChild } from '@angular/core';
import { PhotoBasic } from '../../../core/models/DTOs/PhotoBasic';
import { PhotoService } from '../../../core/services/photo.service';
import { OnInit, Input, OnChanges, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhotoSearchRequest } from '../../../core/models/SearchRequest/PhotoSarchRequest';
import { RouterModule } from '@angular/router';
import { takeUntil } from 'rxjs';
import { Subject } from 'rxjs';
import { SearchService } from '../../../core/services/search.service';
import { distinctUntilChanged } from 'rxjs';
import isEqual from 'lodash.isequal';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.css'
})
export class GalleryComponent implements OnInit, AfterViewInit, OnDestroy{
  @Input() emptyStateMessage: string = 'No photos found';
  @ViewChild('sentinel') sentinel!: ElementRef;
  private onDestroy$ = new Subject<void>();
  private _scrollHandler: (() => void) | null = null;
  private intersectionObserver?: IntersectionObserver;
  searchService = inject(SearchService);
  photoService = inject(PhotoService);

  ngOnInit(): void {
    this.searchService.getSearchObjectAsObservable().pipe(
      takeUntil(this.onDestroy$),
      distinctUntilChanged((prev, curr) => isEqual(prev, curr))
      ).subscribe((searchObject: Partial<PhotoSearchRequest>) => {
      this.loadPhotos(searchObject);
    });
  }

  ngAfterViewInit(): void {
    this.setupIntersectionObserver();
  }

  loadPhotos(searchObject: Partial<PhotoSearchRequest>): void {
    this.photoService.getPhotos(searchObject).pipe(takeUntil(this.onDestroy$)).subscribe();
  }

  loadMore(): void {
    if (this.photoService.isLoading()) return;
    this.photoService.loadMorePhotos().pipe(takeUntil(this.onDestroy$)).subscribe();
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
      rootMargin: '30px',
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
    this.onDestroy$.next();
    this.onDestroy$.complete();

    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }

    if (this._scrollHandler) {
      window.removeEventListener('scroll', this._scrollHandler);
    }
  }

}


