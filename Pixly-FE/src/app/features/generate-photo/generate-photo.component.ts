import { Component, inject } from '@angular/core';
import { NavBarComponent } from '../../shared/components/nav-bar/nav-bar.component';
import { CommonModule } from '@angular/common';
import { AiGeneratorService, ImageGenerationRequest } from '../../core/services/ai-generator.service';
import { AuthState } from '../../core/state/auth.state';
import { Router } from '@angular/router';
@Component({
  selector: 'app-generate-photo',
  standalone: true,
  imports: [
    NavBarComponent,
    CommonModule
  ],
  templateUrl: './generate-photo.component.html',
  styleUrls: ['./generate-photo.component.css']
})
export class GeneratePhotoComponent {
  
  private imageGenerator = inject(AiGeneratorService);
  private authState = inject(AuthState);
  private router = inject(Router);
  generatedImageUrl: string | null = null;
  promptValue: string = '';
  isLoading: boolean = false;
  error: string = '';

  onPromptChange(value: string): void {
    this.promptValue = value;
    if (this.error) {
      this.error = '';
    }
  }

  clearPrompt(inputElement: HTMLInputElement): void {
    inputElement.value = '';
    this.promptValue = '';
    this.error = '';
  }

  generateImage(prompt: string): void {

    if(!this.authState.currentUser) this.router.navigate(['/login'], { queryParams: { returnUrl: '/generate-photo' }});

    if (!prompt.trim()) {
      this.error = 'Please enter a description for your image';
      return;
    }

    this.isLoading = true;
    this.error = '';
    this.generatedImageUrl = null;

    const request: ImageGenerationRequest = {
      prompt: prompt,
      size: '1024x1024',
      model: 'dall-e-3',
      quality: 'standard'
    };

    this.imageGenerator.generateImage(request).subscribe({
      next: (response) => {
        this.generatedImageUrl = response.data[0].url;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error generating image:', error);
        this.isLoading = false;
        
        if (error.error?.error?.message) {
          this.error = error.error.error.message;
        } else if (error.message) {
          this.error = error.message;
        } else {
          this.error = 'Failed to generate image. Please try again.';
        }
      }
    });
  }

  downloadImage(): void {
    if (!this.generatedImageUrl) return;

    this.downloadWithFetch()
      .catch(() => {

        return this.downloadWithCanvas();
      })
      .catch(() => {

        this.fallbackDownload();
      });
  }

  private async downloadWithFetch(): Promise<void> {
    try {
      const response = await fetch(this.generatedImageUrl!, { 
        mode: 'cors',
        cache: 'no-cache',
        headers: {
          'Accept': 'image/*'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const blob = await response.blob();
      
      if (!blob.type.startsWith('image/')) {
        throw new Error('Response is not an image');
      }
      
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `ai-generated-image-${this.generateTimestamp()}.png`;
      link.style.display = 'none';
      link.rel = 'noopener';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 100);
      
    } catch (error) {
      console.error('Fetch download failed:', error);
      throw error; 
    }
  }

  private downloadWithCanvas(): Promise<void> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          if (!ctx) {
            reject(new Error('Canvas context not available'));
            return;
          }
          
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          

          ctx.drawImage(img, 0, 0);

          canvas.toBlob((blob) => {
            if (blob) {
              const url = window.URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.download = `ai-generated-image-${this.generateTimestamp()}.png`;
              link.style.display = 'none';
              
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              
              setTimeout(() => {
                window.URL.revokeObjectURL(url);
              }, 100);
              
              resolve();
            } else {
              reject(new Error('Failed to create blob from canvas'));
            }
          }, 'image/png', 1.0); 
          
        } catch (error) {
          reject(error);
        }
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image for canvas download'));
      };
      
      img.src = this.generatedImageUrl!;
    });
  }

  private fallbackDownload(): void {
    if (this.generatedImageUrl) {
      const newWindow = window.open(this.generatedImageUrl, '_blank', 'noopener,noreferrer');
      
      if (newWindow) {
        this.error = 'Download not supported in your browser. Image opened in new tab - right-click to save.';
        
        setTimeout(() => {
          this.error = '';
        }, 5000);
      } else {
        this.error = 'Unable to download or open image. Please check your browser settings.';
      }
    }
  }

  shareImage(): void {
    if (!this.generatedImageUrl) return;

    if (navigator.share && navigator.canShare) {
      const shareData = {
        title: 'AI Generated Image',
        text: `Check out this AI generated image! Prompt: "${this.promptValue}"`,
        url: this.generatedImageUrl
      };

      if (navigator.canShare(shareData)) {
        navigator.share(shareData).catch((error) => {
          console.error('Error sharing:', error);
          this.copyToClipboard();
        });
      } else {
        this.copyToClipboard();
      }
    } else {
      this.copyToClipboard();
    }
  }

  private async copyToClipboard(): Promise<void> {
    if (!this.generatedImageUrl) return;

    try {
      await navigator.clipboard.writeText(this.generatedImageUrl);
      const originalError = this.error;
      this.error = 'Image URL copied to clipboard!';
      
      setTimeout(() => {
        this.error = originalError;
      }, 3000);
      
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      this.error = 'Failed to copy image URL to clipboard';

      setTimeout(() => {
        this.error = '';
      }, 3000);
    }
  }

  regenerateImage(): void {
    if (this.promptValue.trim()) {
      this.generateImage(this.promptValue);
    } else {
      this.error = 'Please enter a prompt before regenerating';
    }
  }

  clearImage(): void {
    this.generatedImageUrl = null;
    this.error = '';
  }

  shouldShowPlaceholder(): boolean {
    return !this.generatedImageUrl && !this.isLoading;
  }

  getCurrentImageSrc(): string {
    return this.generatedImageUrl || 'assets/image/test2.jpg';
  }

  onImageError(): void {
    this.error = 'Failed to load the generated image';
    this.generatedImageUrl = null;
    this.isLoading = false;
  }

  onImageLoad(): void {
    console.log('Image loaded successfully');
    if (this.error.includes('Failed to load')) {
      this.error = '';
    }
  }

  private generateTimestamp(): string {
    const now = new Date();
    return now.toISOString()
      .slice(0, 19)
      .replace(/:/g, '-')
      .replace('T', '_');
  }

  onEnterKey(event: KeyboardEvent, prompt: string): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.generateImage(prompt);
    }
  }

  getErrorType(): string {
    if (this.error.includes('copied')) {
      return 'success';
    } else if (this.error.includes('opened in new tab')) {
      return 'info';
    }
    return 'error';
  }

  areActionsDisabled(): boolean {
    return this.isLoading || !this.generatedImageUrl;
  }
}