import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AfterViewInit, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { Input } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-tags-show',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './tags-show.component.html',
  styleUrl: './tags-show.component.css'
})
export class TagsShowComponent implements AfterViewInit, OnDestroy {
  @Input() tags: string[] = [];
   @ViewChild('tagsContainer', { static: false }) tagsContainer!: ElementRef;
  router = inject(Router);
  showLeftArrow = false;
  showRightArrow = false;
  private resizeObserver?: ResizeObserver;

  ngAfterViewInit() {
    this.updateArrowVisibility();
    
    if (window.ResizeObserver) {
      this.resizeObserver = new ResizeObserver(() => {
        this.updateArrowVisibility();
      });
      this.resizeObserver.observe(this.tagsContainer.nativeElement);
    }

    setTimeout(() => this.updateArrowVisibility(), 100);
  }

  ngOnDestroy() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  scrollLeft() {
    const container = this.tagsContainer.nativeElement;
    container.scrollBy({
      left: -200,
      behavior: 'smooth'
    });
  }

  scrollRight() {
    const container = this.tagsContainer.nativeElement;
    container.scrollBy({
      left: 200,
      behavior: 'smooth'
    });
  }

  onScroll() {
    this.updateArrowVisibility();
  }

 private updateArrowVisibility() {
    const container = this.tagsContainer?.nativeElement;
    
    if (!container) return;

    // Provjera da li ima overflow sadržaja
    const hasOverflow = container.scrollWidth > container.clientWidth;
    
    // Provjera pozicije scrolla
    const isAtStart = container.scrollLeft <= 0;
    const isAtEnd = Math.abs(container.scrollWidth - container.clientWidth - container.scrollLeft) <= 1;

    // Postavi vidljivost strelica
    this.showLeftArrow = hasOverflow && !isAtStart;
    this.showRightArrow = hasOverflow && !isAtEnd;
}
}
