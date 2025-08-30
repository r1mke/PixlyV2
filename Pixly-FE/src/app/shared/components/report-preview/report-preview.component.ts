import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubmitButtonComponent } from '../submit-button/submit-button.component';
import { Output, EventEmitter } from '@angular/core';
import { Report } from '../../../core/models/DTOs/Report';
import { HelperService } from '../../../core/services/helper.service';
import { inject } from '@angular/core';
import { ReportService } from '../../../core/services/report.service';
import { AuthService } from '../../../core/services/auth.service';
import { AuthState } from '../../../core/state/auth.state';
import { ReportUpdateRequest } from '../../../core/models/UpdateRequest/ReportUpdateRequest';
import { PhotoService } from '../../../core/services/photo.service';
@Component({
  selector: 'app-report-preview',
  standalone: true,
  imports: [CommonModule, SubmitButtonComponent],
  templateUrl: './report-preview.component.html',
  styleUrl: './report-preview.component.css'
})
export class ReportPreviewComponent {
  @Input() report!: Report;
  @Input() canModifyReport: boolean = true;
  @Output() closeActiveReport = new EventEmitter<boolean>();
  @Output() resolveReport = new EventEmitter<{reportId: number, reportStatusId: number,photoId: number, message: string}>();
  reportService = inject(ReportService);
  authService = inject(AuthService);
  helperService = inject(HelperService);
  isProcessing = false;
  isViewingPhoto = false;
  authState = inject(AuthState);
  photoService = inject(PhotoService);

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      return `Pre ${diffInMinutes} minuta`;
    } else if (diffInHours < 24) {
      return `Pre ${diffInHours} sati`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `Pre ${diffInDays} dana`;
    }
  }

  getReportTypeBadgeClass(reportType: string): string {
    const criticalTypes = ['Nudity', 'Violence', 'Hate Speech', 'Copyright'];
    const warningTypes = ['Inappropriate Content', 'Privacy Violation'];
    
    if (criticalTypes.some(type => reportType?.includes(type))) {
      return 'critical';
    } else if (warningTypes.some(type => reportType?.includes(type))) {
      return 'warning';
    }
    return 'info';
  }

  getStatusIcon(status: string): string {
    const iconMap: {[key: string]: string} = {
      'Pending': 'fas fa-clock',
      'Under Review': 'fas fa-search',
      'Resolved': 'fas fa-check-circle',
      'Dismissed': 'fas fa-times-circle',
      'Escalated': 'fas fa-exclamation-triangle'
    };
    return iconMap[status] || 'fas fa-question-circle';
  }

  onImageError(event: any): void {
    event.target.src = '/assets/images/image-placeholder.png';
  }

 

  async viewOriginalPhoto(): Promise<void> {
    this.isViewingPhoto = true;
    
    try {
      // Open photo in new tab or navigate to photo detail page
      const photoUrl = `/photo/${this.report.photo.photoId}`;
      window.open(photoUrl, '_blank');
    } catch (error) {
    } finally {
      this.isViewingPhoto = false;
    }
  }


}
 
