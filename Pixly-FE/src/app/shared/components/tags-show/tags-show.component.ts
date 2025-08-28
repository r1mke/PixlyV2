import { Component, inject, OnChanges,ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AfterViewInit, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { Input } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { SimpleChanges } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Component({
  selector: 'app-tags-show',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './tags-show.component.html',
  styleUrl: './tags-show.component.css'
})
export class TagsShowComponent implements AfterViewInit, OnDestroy, OnChanges {
  @Input() tags: string[] = [];
  @ViewChild('tagsContainer', { static: false }) tagsContainer!: ElementRef;
  
  router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  
  showLeftArrow = false;
  showRightArrow = false;
  private resizeObserver?: ResizeObserver;
  private lastScrollWidth = 0;
  private lastClientWidth = 0;
  private viewChecked = false;

  ngAfterViewInit() {
    this.setupResizeObserver();
    setTimeout(() => this.checkArrows(), 0);
  }

  ngAfterViewChecked() {
    // Provjeri da li se dimenzije promijenile
    if (this.tagsContainer?.nativeElement) {
      const container = this.tagsContainer.nativeElement;
      const currentScrollWidth = container.scrollWidth;
      const currentClientWidth = container.clientWidth;
      
      if (currentScrollWidth !== this.lastScrollWidth || 
          currentClientWidth !== this.lastClientWidth) {
        this.lastScrollWidth = currentScrollWidth;
        this.lastClientWidth = currentClientWidth;
        
        // Odloži promjenu do sljedećeg ciklusa da izbjegneš ExpressionChangedAfterItHasBeenCheckedError
        Promise.resolve().then(() => {
          this.checkArrows();
        });
      }
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['tags']) {
      console.log("Tags changed:", this.tags);
      // Reset dimenzije kada se tagovi promijene
      this.lastScrollWidth = 0;
      this.lastClientWidth = 0;
    }
  }

  ngOnDestroy() {
    this.resizeObserver?.disconnect();
  }

  scrollLeft() {
    const container = this.tagsContainer.nativeElement;
    container.scrollBy({ left: -200, behavior: 'smooth' });
    setTimeout(() => this.checkArrows(), 350);
  }

  scrollRight() {
    const container = this.tagsContainer.nativeElement;
    container.scrollBy({ left: 200, behavior: 'smooth' });
    setTimeout(() => this.checkArrows(), 350);
  }

  onScroll() {
    this.checkArrows();
  }

  private setupResizeObserver() {
    this.resizeObserver = new ResizeObserver(() => {
      console.log('ResizeObserver triggered');
      this.checkArrows();
    });

    if (this.tagsContainer?.nativeElement) {
      this.resizeObserver.observe(this.tagsContainer.nativeElement);
    }
  }

  private checkArrows() {
    console.log("Checking arrows...");
    
    if (!this.tagsContainer?.nativeElement) {
      console.log("Container not available");
      return;
    }
    
    const container = this.tagsContainer.nativeElement;
    
    // Ako nema tagova, sakrij strelice
    if (!this.tags || this.tags.length === 0) {
      this.updateArrowsState(false, false);
      return;
    }

    // Debug informacije
    console.log('Container dimensions:', {
      scrollWidth: container.scrollWidth,
      clientWidth: container.clientWidth,
      scrollLeft: container.scrollLeft,
      tagsCount: this.tags.length
    });

    const hasOverflow = container.scrollWidth > container.clientWidth;
    const isAtStart = container.scrollLeft <= 1;
    const isAtEnd = Math.ceil(container.scrollLeft + container.clientWidth) >= container.scrollWidth - 1;

    console.log('Scroll states:', {
      hasOverflow,
      isAtStart,
      isAtEnd
    });

    const newShowLeftArrow = hasOverflow && !isAtStart;
    const newShowRightArrow = hasOverflow && !isAtEnd;

    this.updateArrowsState(newShowLeftArrow, newShowRightArrow);
  }

  private updateArrowsState(showLeft: boolean, showRight: boolean) {
    if (this.showLeftArrow !== showLeft || this.showRightArrow !== showRight) {
      this.showLeftArrow = showLeft;
      this.showRightArrow = showRight;
      
      console.log('Arrows updated:', {
        showLeftArrow: this.showLeftArrow,
        showRightArrow: this.showRightArrow
      });
    }
  }
}
