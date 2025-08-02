import { Component, inject, OnInit, OnDestroy, Output } from '@angular/core';
import { TotalCardComponent } from "../../../shared/components/total-card/total-card.component";
import { DropdownComponent } from "../../../shared/components/dropdown/dropdown.component";
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
@Component({
  selector: 'app-content',
  standalone: true,
  imports: [TotalCardComponent, DropdownComponent, PhotoCardComponent, CommonModule],
  templateUrl: './content.component.html',
  styleUrl: './content.component.css'
})
export class ContentComponent implements OnInit, OnDestroy {
  loadingService = inject(LoadingService);
  photoService = inject(PhotoService);
  adminService = inject(AdminService);
  private destroy$ = new Subject<void>();
  dropDownOption: string = 'Pending';
  dashBoardData! : DashboardOverview;
  photoSearchRequest: Partial<PhotoSearchRequest> = {
    state : "Pending",
    pageSize: 10,
    pageNumber: 1,
    isUserIncluded: true,
    isAdmin: true
  }

  ngOnInit(): void {
    this.getDataForCard();
    this.getPhotosByState("Pending");
  }

  getDataForCard() {
    this.loadingService.setLoading(true);
    this.adminService.getDashboardOverview({numberOfDays: 90}).pipe(takeUntil(this.destroy$)).subscribe({
      next : (res : ApiResponse<DashboardOverview>)=> {
        this.dashBoardData = res.data;
      },
      error: (error) => {
        console.error('Error fetching dashboard overview:', error);
      }
    })
  }

  get photos(): PhotoBasic[] {
    return this.photoService.photos();
  }

  getPhotosByState(state: string) : void {
    this.photoSearchRequest.state = state;
    console.log("Poziv");
    this.loadingService.setLoading(true);
    this.photoService.getPhotos(this.photoSearchRequest).pipe(takeUntil(this.destroy$)).subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  dropdownOptions: DropdownValue = {
      mode: 'Range',
      value: ["Approved", "Pending", "Rejected", "Reported"],
      selectedOption: "Pending"
    };

  saveSelectedValueFromDropdown(option: string): void {
    this.dropDownOption = option;
    this.getPhotosByState(option);
  } 

  handlePhotoActionCompleted(event: {action: string, photoId: number}): void {
    this.getPhotosByState(this.dropDownOption);
  }
}
