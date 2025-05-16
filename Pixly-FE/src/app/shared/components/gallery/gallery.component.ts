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
  @Input() photoSearchRequest: PhotoSearchRequest = {
    username: null,
    title: null,
    orientation: null,
    size: null,
    isUserIncluded: null,
    sorting: null,
    isLiked: null,
    isSaved: null,
    pageNumber: 1,
    pageSize: 7
  };
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
    
    
    this.intersectionObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !this.photoService.isLoading()) {
        this.loadMore();
      }
    }, {
      root: null,
      rootMargin: '200px', // Učitaj ranije, prije nego korisnik dosegne kraj
      threshold: 0.1
    });
    
    this.intersectionObserver.observe(this.sentinel.nativeElement);
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
  
  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
  }

}
  

