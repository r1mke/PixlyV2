import { Component, OnInit, OnDestroy, inject, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EMPTY, Observable, Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { TextInputComponent } from "../text-input/text-input.component";
import { TagsShowComponent } from '../tags-show/tags-show.component';
import { TagInputComponent } from "../tag-input/tag-input.component";
import { SubmitButtonComponent } from '../submit-button/submit-button.component';
import { PhotoService } from '../../../core/services/photo.service';
import { UploadService, UploadedFile } from '../../../core/services/upload.service';
import { ToastService } from '../../../core/services/toast.service';
import { AuthState } from '../../../core/state/auth.state';
import { ApiResponse } from '../../../core/models/Response/api-response';
import { PhotoBasic } from '../../../core/models/DTOs/PhotoBasic';
import { PhotoInsertRequest } from '../../../core/models/InsertRequest/PhotoInsertRequest';
import { SelectFilterComponent } from "../select-filter/select-filter.component";

@Component({
  selector: 'app-upload-submit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TextInputComponent,
    TagsShowComponent,
    TagInputComponent,
    SubmitButtonComponent,
    
],
  templateUrl: './upload-submit.component.html',
  styleUrls: ['./upload-submit.component.css']
})
export class UploadSubmitComponent implements OnInit, OnDestroy {

  photoUploadForm!: FormGroup;
  currentTags: string[] = [];
  uploadedFile: UploadedFile | null = null;
  isSubmitting = false;
  
  private destroy$ = new Subject<void>();
  private fb = inject(FormBuilder);
  private uploadService = inject(UploadService);
  private toastService = inject(ToastService);
  private authState = inject(AuthState);
  private photoService = inject(PhotoService);
  private router = inject(Router);

  ngOnInit(): void {
    this.initForm();
    this.loadUploadedFile();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initForm(): void {
    this.photoUploadForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(30)]],
      description: ['', [Validators.maxLength(200)]],
      tags: [[], [Validators.required, Validators.minLength(1)]],
    });
  }

  private loadUploadedFile(): void {
    this.uploadService.uploadedFile$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(file => {
      if(file != null){
        this.uploadedFile = file;
      } else {
        this.uploadedFile = null;
      }
    });
  }

  onTagAdded(tag: string): void {
    if (!tag || tag.trim() === '') return;
    
    const trimmedTag = tag.trim().toLowerCase();
    if (!this.currentTags.includes(trimmedTag)) {
      this.currentTags = [...this.currentTags, trimmedTag];
      
      this.photoUploadForm.patchValue({
        tags: this.currentTags
      });
      
      this.photoUploadForm.get('tags')?.markAsTouched();
    }
  }

  onTagRemoved(tag: string): void {
    this.currentTags = this.currentTags.filter(t => t !== tag);
    this.photoUploadForm.patchValue({
      tags: this.currentTags
    });
  }

 onSubmit(): void {
  console.log(this.photoUploadForm.value);

  if (this.photoUploadForm.invalid) {
    this.markAllFieldsAsTouched();
    this.toastService.error('Please fill in all required fields correctly');  
    return;
  }

  if (!this.uploadedFile) {
    this.toastService.error('No file selected for upload');
    return;
  }

  const currentUser = this.authState.currentUser;
  if (!currentUser) {
    this.toastService.error('You must be logged in to upload photos');
    return;
  }

  const formData = new FormData();
  formData.append("userId", currentUser.id);
  formData.append("title", this.photoUploadForm.get('title')?.value);
  formData.append("description", this.photoUploadForm.get('description')?.value || '');
  formData.append("file", this.uploadedFile.file);
  formData.append("isDraft", 'false');

  const tagIds = [1, 2]; // ili iz forme
  tagIds.forEach(id => formData.append("tagIds", id.toString()));

  this.isSubmitting = true;

  this.photoService.uploadPhoto(formData).subscribe({
    next: (res: ApiResponse<PhotoBasic>) => {
      this.toastService.success(res.message);
      console.log("Upload prošao");
    },
    error: (err) => {
      this.toastService.error(err.message);
    },
    complete: () => {
      this.isSubmitting = false;
      this.router.navigate(['/']);
    }
  });
}


  private async getTagIds(tagNames: string[]): Promise<number[]> {
    // TODO: Implement tag service to get or create tag IDs
    // For now, return mock IDs
    return tagNames.map((_, index) => index + 1);
  }

  onChangeImage(): void {
    this.uploadService.clearUploadedFile();
  }

  onSaveAsDraft(): void {
    // TODO: Implement save as draft functionality
    this.toastService.info('Save as draft functionality will be implemented');
  }

 

  private markAllFieldsAsTouched(): void {
    Object.keys(this.photoUploadForm.controls).forEach(key => {
      this.photoUploadForm.get(key)?.markAsTouched();
    });
  }
}