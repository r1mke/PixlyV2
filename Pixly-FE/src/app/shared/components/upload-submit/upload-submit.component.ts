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
        tags: [[], [Validators.required]],
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
    // POBOLJŠANO: Provjera da tag nije prazan i već ne postoji
    if (!tag || tag.trim() === '') return;
    
    const trimmedTag = tag.trim();
    if (!this.currentTags.includes(trimmedTag)) {
      // PROMJENA: Kreiranje novog array-a da se trigguje change detection
      this.currentTags = [...this.currentTags, trimmedTag];
      
      // Ažuriranje form kontrole
      this.photoUploadForm.patchValue({
        tags: this.currentTags
      });
      
      console.log('Tag added:', trimmedTag);
      console.log('Current tags:', this.currentTags);
      
      // DODANO: Markiramo field kao touched da se pokrenu validacije
      this.photoUploadForm.get('tags')?.markAsTouched();
    }
  }

  onTagRemoved(tag: string): void {
    this.currentTags = this.currentTags.filter(t => t !== tag);
    this.photoUploadForm.patchValue({
      tags: this.currentTags
    });
    console.log('Tag removed:', tag);
    console.log('Current tags:', this.currentTags);
  }

   private markAllFieldsAsTouched(): void {
    Object.keys(this.photoUploadForm.controls).forEach(key => {
      this.photoUploadForm.get(key)?.markAsTouched();
    });
  }
}
