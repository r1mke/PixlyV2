import { Component } from '@angular/core';
import { TextInputComponent } from "../text-input/text-input.component";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { OnInit } from '@angular/core';
import { TagsShowComponent } from '../tags-show/tags-show.component';
import { TagInputComponent } from "../tag-input/tag-input.component";
@Component({
  selector: 'app-upload-submit',
  standalone: true,
  imports: [TextInputComponent, ReactiveFormsModule, TagsShowComponent, TagInputComponent],
  templateUrl: './upload-submit.component.html',
  styleUrl: './upload-submit.component.css'
})
export class UploadSubmitComponent implements OnInit {
  photoUploadForm!: FormGroup;
  currentTags: string[] = [];
  constructor(private fb: FormBuilder) {} 

  ngOnInit(){
    this.initForm();
  }

   initForm(): void {
      this.photoUploadForm = this.fb.group({
        title: [null, [Validators.required, Validators.minLength(5), Validators.maxLength(30)]],
        description: [null, [Validators.minLength(5), Validators.maxLength(50)]],
        tags: [null, [Validators.required]],
        location: [null, [Validators.required]],
      });
    }

    onSubmit(): void {
    if (this.photoUploadForm.valid) {
      console.log('Form Data:', this.photoUploadForm.value);
      // Ovdje pošaljite podatke na server
    } else {
      console.log('Form is invalid');
      this.markAllFieldsAsTouched();
    }
  }

   onTagAdded(tag: string): void {
    const currentTags = this.photoUploadForm.get('tags')?.value || [];
    if (!currentTags.includes(tag)) {
      this.currentTags = [...currentTags, tag];
      this.photoUploadForm.patchValue({
        tags: this.currentTags
      });
      console.log('Current tags:', this.currentTags);
    }
  }

   private markAllFieldsAsTouched(): void {
    Object.keys(this.photoUploadForm.controls).forEach(key => {
      this.photoUploadForm.get(key)?.markAsTouched();
    });
  }
}
