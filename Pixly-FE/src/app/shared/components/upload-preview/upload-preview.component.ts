import { Component, ElementRef, ViewChild, OnDestroy, inject, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadService, UploadedFile } from '../../../core/services/upload.service';
import { ToastService } from '../../../core/services/toast.service';
import { Subject, takeUntil } from 'rxjs';
@Component({
  selector: 'app-upload-preview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './upload-preview.component.html',
  styleUrls: ['./upload-preview.component.css']
})
export class UploadPreviewComponent implements OnDestroy, OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  
  isDragOver = false;
  isUploading = false;
  uploadedFile: boolean = false; 
  private destroy$ = new Subject<void>();

  private uploadService = inject(UploadService);
  private toastService = inject(ToastService);

   ngOnInit(): void {
    this.loadUploadedFile();
  }

  // Drag and Drop event handlers
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = true;
  }

   private loadUploadedFile(): void {
      this.uploadService.uploadedFile$.pipe(
        takeUntil(this.destroy$)
      ).subscribe(file => {
        if(file != null){
          this.uploadedFile = true;
        } else {
          this.uploadedFile = false;
        }

      });
    }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFileSelection(files[0]);
    }
  }

  // Browse button click handler
  onBrowseClick(): void {
    this.fileInput.nativeElement.click();
  }

  // File input change handler
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFileSelection(input.files[0]);
    }
  }

  // Main file handling logic
  private async handleFileSelection(file: File): Promise<void> {
    try {
      this.isUploading = true;

      // Validate file
      const validation = this.uploadService.validateFile(file);
      if (!validation.isValid) {
        const errorMessage = validation.error || 'Invalid file';
        this.toastService.error(errorMessage);
        return;
      }

      // Create preview
      const preview = await this.uploadService.createFilePreview(file);

      // Create uploaded file object
      const uploadedFile: UploadedFile = {
        file,
        preview,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type
      };

      // Save to service
      this.uploadService.setUploadedFile(uploadedFile);

      // Show success message
      this.toastService.success('File uploaded successfully!');

    } catch (error) {
      console.error('Error handling file:', error);
      const errorMessage = 'Error processing file. Please try again.';
      this.toastService.error(errorMessage);
    } finally {
      this.isUploading = false;
      // Reset file input
      if (this.fileInput) {
        this.fileInput.nativeElement.value = '';
      }
    }
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }
}