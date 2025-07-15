import { Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs';
export interface UploadedFile {
  file: File;
  preview: string;
  fileName: string;
  fileSize: number;
  fileType: string;
}

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  private uploadedFileSubject = new BehaviorSubject<UploadedFile | null>(null);
  public uploadedFile$ = this.uploadedFileSubject.asObservable();

  constructor() {}

  setUploadedFile(file: UploadedFile | null): void {
    this.uploadedFileSubject.next(file);
  }

  getUploadedFile(): Observable<UploadedFile | null> {
    return this.uploadedFileSubject.asObservable();
  }

  clearUploadedFile(): void {
    this.setUploadedFile(null);
  }

  createFilePreview(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  validateFile(file: File): { isValid: boolean; error?: string } {
    // Provjera tipova fajlova
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: 'Only JPEG, PNG and WebP images are allowed'
      };
    }

    // Provjera veličine (maksimalno 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return {
        isValid: false,
        error: 'File size must be less than 10MB'
      };
    }

    // Minimum veličina (100KB)
    const minSize = 100 * 1024; // 100KB
    if (file.size < minSize) {
      return {
        isValid: false,
        error: 'File size must be at least 100KB'
      };
    }

    return { isValid: true };
  }

}

