import { Component } from '@angular/core';
import { TotalCardComponent } from "../../../shared/components/total-card/total-card.component";
import { OnInit } from '@angular/core';
import { DashboardOverview } from '../../../core/models/AdminDTOs/DashboardOverview';
import { AdminService } from '../../../core/services/admin.service';
import { inject } from '@angular/core';
import { Subject } from 'rxjs';
import { LineChartComponent, LineChartData } from '../../../shared/components/line-chart/line-chart.component';
import { OnDestroy } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { DailyUploadedPhotos } from '../../../core/models/AdminDTOs/DailyUploadedPhotos';
import { DashboardOverviewSearchRequest } from '../../../core/models/SearchRequest/DashboardOverviewSearchRequest';
import { DropdownValue } from '../../../core/models/Dropdown/DropdownValue';
import { DropdownComponent } from "../../../shared/components/dropdown/dropdown.component";

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [TotalCardComponent, DropdownComponent, LineChartComponent],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.css'
})
export class OverviewComponent implements OnInit, OnDestroy {
  
  private adminService = inject(AdminService);
  dashboardOverview: DashboardOverview | null = null;
  private destroy$ = new Subject<void>();
  selectedPeriod: number = 7;
  
  lineChartData: LineChartData = {
    labels: [],
    datasets: [{
      label: 'Number of Photos Uploaded',
      data: []
    }]
  };

  dropdownDays: DropdownValue = {
    mode: 'Range',
    value: ["7 days", "30 days", "90 days", "365 days"],
    selectedOption: "7 days"
  };

  saveSelectedValueFromDropdown(option: string): void {
    console.log('Selected option from dropdown:', option);
    const numberOfDays = this.getNumberOfDays(option);
    this.selectedPeriod = numberOfDays;
    this.getDashboardOverview({ numberOfDays: numberOfDays });
  }

  getNumberOfDays(option: string): number {
    switch (option) {
      case "7 days":
        return 7;
      case "30 days":
        return 30;
      case "90 days":
        return 90;
      case "365 days":
        return 365;
      default:
        return 7;
    }
  }

  ngOnInit(): void {
    this.getDashboardOverview({ numberOfDays: 7 });
  }

  getDashboardOverview(request: DashboardOverviewSearchRequest): void {
    console.log('Fetching dashboard overview with request:', request);
    this.adminService.getDashboardOverview(request).pipe(takeUntil(this.destroy$)).subscribe({
      next: (response) => {
        if (response.success) {
          this.dashboardOverview = response.data;
          
          // Ažuriranje chart podataka sa Pixly bojama
          this.lineChartData = {
            labels: this.dashboardOverview.lastFewDayInfo.map((photo: DailyUploadedPhotos) => photo.day),
            datasets: [{
              label: `Photos Uploaded (Last ${this.selectedPeriod} Days)`,
              data: this.dashboardOverview.lastFewDayInfo.map((photo: DailyUploadedPhotos) => photo.numberOfPhotos),
            }]
          };
          
          console.log('Updated chart data:', this.lineChartData);
          console.log('Dashboard Overview:', this.dashboardOverview);
        } else {
          console.error('Failed to fetch dashboard overview:', response.message);
        }
      },
      error: (error) => {
        console.error('Error fetching dashboard overview:', error);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Dodatne metode za različite chart stilove (opciono)
  
  // Promijeni chart stil na business tema
  setBusinessTheme(): void {
    if (this.lineChartData.datasets[0]) {
      this.lineChartData = {
        ...this.lineChartData,
        datasets: [{
          ...this.lineChartData.datasets[0],
        }]
      };
    }
  }

  // Promijeni chart stil na vibrant tema
  setVibrantTheme(): void {
    if (this.lineChartData.datasets[0]) {
      this.lineChartData = {
        ...this.lineChartData,
        datasets: [{
          ...this.lineChartData.datasets[0]
        }]
      };
    }
  }
}