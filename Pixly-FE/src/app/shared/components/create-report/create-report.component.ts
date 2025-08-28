import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SubmitButtonComponent } from '../submit-button/submit-button.component';
import { ReportService } from '../../../core/services/report.service';
import { AuthService } from '../../../core/services/auth.service';
import { HelperService } from '../../../core/services/helper.service';
import { AuthState } from '../../../core/state/auth.state';
import { ReportType } from '../../../core/models/DTOs/ReportType';
import { PhotoDetail } from '../../../core/models/DTOs/PhotoDetail';
import { DropdownComponent } from '../dropdown/dropdown.component';
import { DropdownValue } from '../../../core/models/Dropdown/DropdownValue';
import { TextInputComponent } from "../text-input/text-input.component";
import { ReportInsertRequest } from '../../../core/models/InsertRequest/ReportInsertRequest';
import { ToastService } from '../../../core/services/toast.service';
@Component({
  selector: 'app-create-report',
  standalone: true,
 imports: [CommonModule, FormsModule, ReactiveFormsModule, SubmitButtonComponent, DropdownComponent, TextInputComponent],
  templateUrl: './create-report.component.html',
  styleUrl: './create-report.component.css'
})
export class CreateReportComponent implements OnInit {
  @Input() photo!: PhotoDetail;
  @Input() reportedUserId!: number;
  @Output() closeReportModal = new EventEmitter<boolean>();
  @Output() reportSubmitted = new EventEmitter<{reportTypeId: number, reportMessage: string, reportTitle: string}>();

  reportForm!: FormGroup;
  reportTypes: ReportType[] = [];
  isSubmitting = false;
  isLoadingTypes = false;

  // Injected services
  private fb = inject(FormBuilder);
  private reportService = inject(ReportService);
  private authService = inject(AuthService);
   helperService = inject(HelperService);
  private authState = inject(AuthState);
  private toastService = inject(ToastService);

  dropdownReport : DropdownValue = {
      mode: 'Popularity',
      value : ["Select value"],
      selectedOption: "Select value"      
  };

  ngOnInit(): void {
    this.initializeForm();
    this.getReportTypes();
  }

  private initializeForm(): void {
    this.reportForm = this.fb.group({
      reportTypeId: ['', [Validators.required]],
      reportMessage: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      reportTitle: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(30)]]
    });
  }

   onImageError(event: any): void {
    event.target.src = '/assets/images/image-placeholder.png';
    console.warn('Failed to load photo for report:', this.photo?.url);
  }

  
  selectReportType(value: string): void {
    let selectedReportId = this.reportTypes.find(report => report.reportTypeName === value)?.reportTypeId;
    this.reportForm.patchValue({ reportTypeId: selectedReportId });
  }

  getReportTypes() : void {
    this.reportService.getReportTypes().pipe(
    ).subscribe({
      next: (response) => {
        if (response && response.data) {
          this.reportTypes = response.data;
          this.dropdownReport.value?.push(...this.reportTypes.map(type => type.reportTypeName));
          console.log(this.reportTypes);
        }
      },
      error: (error) => {
        console.error('Error loading report types:', error);
      }
    });
  }

  closeModal(): void {
    this.closeReportModal.emit(false);
  }


  isFieldInvalid(fieldName: string): boolean {
    const control = this.reportForm.get(fieldName);
    return !!(control?.touched && control?.invalid);
  }

  submitReport() {
    if (this.reportForm.invalid || !this.authService.currentUser$) {
      this.reportForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    const reportData = {
      reportTypeId: this.reportForm.value.reportTypeId,
      reportMessage: this.reportForm.value.reportMessage,
      reportTitle: this.reportForm.value.reportTitle
    };

     const formData = new FormData();
      formData.append("reportTitle", reportData.reportTitle);
      formData.append("reportMessage", reportData.reportMessage);
      formData.append("reportTypeId", reportData.reportTypeId);
      formData.append("reportedUserId", this.photo.userId);
      formData.append("photoId", this.photo.photoId.toString());
      formData.append("reportedByUserId", this.authState.currentUser?.id!);
      
    this.reportService.createReport(formData).subscribe({
      next: (response) => {
        console.log('Report submitted successfully:', response);
        this.toastService.success('Report submitted successfully.');
        this.isSubmitting = false;
        this.closeModal();
      },
      error: (error) => {
        console.error('Error submitting report:', error);
        this.toastService.error('Failed to submit report. Please try again.');
        this.isSubmitting = false;
      }
    })

    this.reportService.createReport

    this.isSubmitting = false;
    this.closeModal();
  }

  
}
