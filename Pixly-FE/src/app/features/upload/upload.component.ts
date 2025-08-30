import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';

import { NavBarComponent } from "../../shared/components/nav-bar/nav-bar.component";
import { UploadPreviewComponent } from "../../shared/components/upload-preview/upload-preview.component";
import { UploadSubmitComponent } from "../../shared/components/upload-submit/upload-submit.component";

import { UploadService, UploadedFile } from '../../core/services/upload.service';

export type UploadStep = 'preview' | 'submit';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [
    CommonModule,
    NavBarComponent, 
    UploadPreviewComponent, 
    UploadSubmitComponent
  ],
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit, OnDestroy {
  currentStep: UploadStep = 'preview';
  uploadedFile: UploadedFile | null = null;
  
  private destroy$ = new Subject<void>();
  private uploadService = inject(UploadService);

  ngOnInit(): void {
    this.subscribeToUploadState();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private subscribeToUploadState(): void {
    this.uploadService.uploadedFile$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(file => {
      this.uploadedFile = file;
      
      // Automatically switch to submit step when file is uploaded
      if (file) {
        this.currentStep = 'submit';
      } else {
        this.currentStep = 'preview';
      }
    });
  }

  onStepChange(step: UploadStep): void {
    this.currentStep = step;
  }

  onBackToPreview(): void {
    this.uploadService.clearUploadedFile();
    this.currentStep = 'preview';
  }

  onUploadComplete(): void {
    this.uploadService.clearUploadedFile();
    this.currentStep = 'preview';
  }
}