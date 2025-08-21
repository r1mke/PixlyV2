import { Component, inject, OnInit, OnDestroy, Output } from '@angular/core';
import { TotalCardComponent } from '../../../shared/components/total-card/total-card.component';
import { DropdownComponent } from '../../../shared/components/dropdown/dropdown.component';
import { DropdownValue } from '../../../core/models/Dropdown/DropdownValue';
import { PhotoService } from '../../../core/services/photo.service';
import { Subject, takeUntil } from 'rxjs';
import { PhotoSearchRequest } from '../../../core/models/SearchRequest/PhotoSarchRequest';
import { PhotoCardComponent } from '../../../shared/components/photo-card/photo-card.component';
import { PhotoBasic } from '../../../core/models/DTOs/PhotoBasic';
import { CommonModule } from '@angular/common';
import { LoadingService } from '../../../core/services/loading.service';
import { AdminService } from '../../../core/services/admin.service';
import { DashboardOverview } from '../../../core/models/AdminDTOs/DashboardOverview';
import { ApiResponse } from '../../../core/models/Response/api-response';
import { ReportService } from '../../../core/services/report.service';
import { Report } from '../../../core/models/DTOs/Report';
import { ReportSearchRequest } from '../../../core/models/SearchRequest/ReportSearchRequest';
import { ReportCardComponent } from '../../../shared/components/report-card/report-card.component';
import { ReportPreviewComponent } from '../../../shared/components/report-preview/report-preview.component';
import { AuthState } from '../../../core/state/auth.state';
import { ReportUpdateRequest } from '../../../core/models/UpdateRequest/ReportUpdateRequest';
import e from 'express';
interface activePreviewReport {
  active: boolean;
  report: Report;
}

@Component({
  selector: 'app-content',
  standalone: true,
  imports: [
    TotalCardComponent,
    DropdownComponent,
    PhotoCardComponent,
    CommonModule,
    ReportCardComponent,
    ReportPreviewComponent,
  ],
  templateUrl: './content.component.html',
  styleUrl: './content.component.css',
})
export class ContentComponent implements OnInit, OnDestroy {
  loadingService = inject(LoadingService);
  photoService = inject(PhotoService);
  adminService = inject(AdminService);
  reportService = inject(ReportService);
  authState = inject(AuthState);
  reports: Report[] = [];
  activePreviewReport: activePreviewReport = {
    active: false,
    report: {} as Report,
  };
  private destroy$ = new Subject<void>();
  dropDownOption: string = 'Pending';
  dashBoardData!: DashboardOverview;
  photoSearchRequest: Partial<PhotoSearchRequest> = {
    state: 'Pending',
    pageSize: 10,
    pageNumber: 1,
    isUserIncluded: true,
    isAdmin: true,
  };

  ngOnInit(): void {
    this.getDataForCard();
    this.getPhotosByState('Pending');
    this.getReports();
  }

  getDataForCard() {
    this.loadingService.setLoading(true);
    this.adminService
      .getDashboardOverview({ numberOfDays: 90 })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: ApiResponse<DashboardOverview>) => {
          this.dashBoardData = res.data;
        },
        error: (error) => {
          console.error('Error fetching dashboard overview:', error);
        },
      });
  }

  get photos(): PhotoBasic[] {
    return this.photoService.photos();
  }

  getPhotosByState(state: string): void {
    this.photoSearchRequest.state = state;
    console.log('Poziv');
    this.loadingService.setLoading(true);
    this.photoService
      .getPhotos(this.photoSearchRequest)
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  dropdownOptions: DropdownValue = {
    mode: 'Range',
    value: ['Approved', 'Pending', 'Rejected', 'Reported'],
    selectedOption: 'Pending',
  };

  saveSelectedValueFromDropdown(option: string): void {
    this.dropDownOption = option;
    this.getPhotosByState(option);
  }

  handlePhotoActionCompleted(event: { action: string; photoId: number }): void {
    this.getPhotosByState(this.dropDownOption);
  }

  getReports(): void {
    let reportSearchRequest: ReportSearchRequest = {
      pageSize: 20,
      pageNumber: 1,
      isUserIncluded: true,
      isPhotoIncluded: true,
    };

    this.reportService
      .getReports(reportSearchRequest)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          if (res.success) {
            console.log(res);
            this.reports = res.data;
            console.log(this.reports);
          } else {
            this.reports = [];
          }
        },
        error: (error) => {
          console.error('Error fetching reports:', error);
        },
      });
  }

  handleReportPreviewActive(event: { active: boolean; report: Report }): void {
    console.log(event);
    this.activePreviewReport = event;
    document.body.classList.add('modal-open');
  }

  onOverlayClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.closeActiveReport();
    }
  }

  closeActiveReport(event?: any) {
    this.activePreviewReport.active = false;
    setTimeout(() => {
      this.activePreviewReport.report = {} as Report;
    }, 500);

    document.body.classList.remove('modal-open');
  }

  trackByReportId(index: number, report: Report) {
    return report.reportId;
  }

  resolveReport(event: {
    reportId: number;
    reportStatusId: number;
    photoId: number;
    message: string;
  }) {
    console.log('Deleting report with ID:', event.reportId);
    let reportUpdateRequest: ReportUpdateRequest = {
      reportStatusId: event.reportStatusId,
      adminUserId: this.authState.currentUser?.id || '',
    };
    console.log('Report update request:', reportUpdateRequest);
    this.reportService
      .updateReport(event.reportId, reportUpdateRequest)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          if (res.success) {
            console.log('Report deleted successfully:', res.message);
            console.log('Updated report:', res.data);
            this.getReports();
            if (event.message === 'Approved') {
              this.photoService
                .rejectPhoto(event.photoId)
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                  next: (res: any) => {
                    if (res.success) {
                      console.log('Photo rejected successfully:', res.message);
                      this.getPhotosByState(this.dropDownOption);
                    }
                  },
                  error: (error) => {
                    console.error('Error approving photo:', error);
                  },
                });
            }
          } else {
            console.error('Failed to delete report:', res.message);
          }
        },
        complete: () => {
          this.activePreviewReport.active = false;
        },
      });
  }
}
