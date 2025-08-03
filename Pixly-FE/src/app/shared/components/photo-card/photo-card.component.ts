import { Component, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { SubmitButtonComponent } from "../submit-button/submit-button.component";
import { PhotoBasic } from '../../../core/models/DTOs/PhotoBasic';
import { CommonModule } from '@angular/common';
import { PhotoService } from '../../../core/services/photo.service';
import { inject } from '@angular/core';
import { takeUntil } from 'rxjs';
import { Subject } from 'rxjs';
import { HelperService } from '../../../core/services/helper.service';
import { LoadingService } from '../../../core/services/loading.service';
import { EventEmitter } from '@angular/core';
@Component({
  selector: 'app-photo-card',
  standalone: true,
  imports: [SubmitButtonComponent, CommonModule],
  templateUrl: './photo-card.component.html',
  styleUrl: './photo-card.component.css'
})
export class PhotoCardComponent implements OnInit, OnDestroy{
  @Input() photo!: PhotoBasic;
  @Input() state!: string;
  @Output() photoActionCompleted = new EventEmitter<{action: string, photoId: number}>();

  private destroy$ = new Subject<void>();
  photoService = inject(PhotoService);
  loadingService = inject(LoadingService);
  helperService = inject(HelperService);
  deletePhoto() {
    this.loadingService.setLoading(true);
    this.photoService.deletePhoto(this.photo.photoId).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
        this.photoActionCompleted.emit({action: 'delete', photoId: this.photo.photoId});
        this.loadingService.setLoading(false);
      },
      error: (error) => {
        this.loadingService.setLoading(false);
      }
    });
  }

  approvePhoto() {
    this.loadingService.setLoading(true);
    this.photoService.approvePhoto(this.photo.photoId).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
        this.photoActionCompleted.emit({action: 'approve', photoId: this.photo.photoId});
        this.loadingService.setLoading(false);
      },
      error: (error) => {
        this.loadingService.setLoading(false);
      }
    });
  }

  rejectPhoto() {
    this.loadingService.setLoading(true);
    this.photoService.rejectPhoto(this.photo.photoId).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
        this.photoActionCompleted.emit({action: 'reject', photoId: this.photo.photoId});
        this.loadingService.setLoading(false);
      },
      error: (error) => {
        this.loadingService.setLoading(false);
      }
    });
  }

  ngOnInit(): void {
    
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  
}
