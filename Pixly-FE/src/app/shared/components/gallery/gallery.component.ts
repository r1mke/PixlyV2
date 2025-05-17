import { AfterViewInit, Component, ElementRef, inject, ViewChild } from '@angular/core';
import { PhotoBasic } from '../../../models/DTOs/PhotoBasic';
import { PhotoService } from '../../../services/photoService/photo.service';
import { OnInit, Input, OnChanges, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { SimpleChanges } from '@angular/core';
import { PhotoSearchRequest } from '../../../models/SearchRequest/PhotoSarchRequest';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-gallery',
  imports: [CommonModule, RouterModule],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.css'
})
export class GalleryComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy{
  @Input() mode: 'home' | 'search' | 'profile' | 'liked' | 'saved' = 'home';
  @Input() photoSearchRequest!: PhotoSearchRequest;
  private _scrollHandler: (() => void) | null = null;
  @Input() emptyStateMessage: string = 'Nema pronađenih fotografija';
  @ViewChild('sentinel') sentinel!: ElementRef;
  
  private intersectionObserver?: IntersectionObserver;
  private subscription?: Subscription;
  
  constructor(public photoService: PhotoService) {}
  
  ngOnInit(): void {
    this.loadPhotos();
  }

   ngOnChanges(changes: SimpleChanges): void {
    if ((changes['searchRequest'] && !changes['searchRequest'].firstChange)
    ) {
      this.loadPhotos();
    }
  }
  
  ngAfterViewInit(): void {
    this.setupIntersectionObserver();
  }

  loadPhotos(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    
    this.subscription = this.photoService.loadPhotosForContext({
      mode: this.mode,
      searchRequest : this.photoSearchRequest
    }).subscribe();
  }
  
  loadMore(): void {
    if (this.photoService.isLoading()) return;
    
    this.subscription = this.photoService.loadMorePhotos().subscribe();
  }

  setupIntersectionObserver(): void {
    if (!this.sentinel || !('IntersectionObserver' in window)) {
        console.log('Sentinel element missing or IntersectionObserver not supported');
        // Ako IntersectionObserver nije podržan, koristimo scroll event kao fallback
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
      rootMargin: '300px',
      threshold: 0
    });
    
    this.intersectionObserver.observe(this.sentinel.nativeElement);
  }

  setupScrollListener(): void {
  console.log('Setting up scroll listener as fallback');
  
  const handleScroll = () => {
    if (this.photoService.isLoading()) return;
    
    const scrollPosition = window.scrollY + window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    
    // Učitaj više kad smo blizu kraja (npr. 300px od dna)
    if (documentHeight - scrollPosition < 300) {
      console.log('Loading more photos from scroll');
      this.loadMore();
    }
  };
  window.addEventListener('scroll', handleScroll);
  
  // Zapamti ovo za cleanup u ngOnDestroy
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
  const photos = this.photoService.photos();
  if (!photos || photos.length === 0) {
    return [];
  }
  
 
  const columnCount = 3;
  return photos.filter((_, index) => index % columnCount === columnIndex);
}
  
 ngOnDestroy(): void {
  if (this.subscription) {
    this.subscription.unsubscribe();
  }
  
  if (this.intersectionObserver) {
    this.intersectionObserver.disconnect();
  }
  
  // Ukloni scroll listener ako postoji
  if (this._scrollHandler) {
    window.removeEventListener('scroll', this._scrollHandler);
  }
}

}
  

