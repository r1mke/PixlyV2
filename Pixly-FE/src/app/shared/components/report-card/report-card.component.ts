import { Component, OnInit, OnChanges, SimpleChanges, Output } from '@angular/core';
import { SubmitButtonComponent } from "../submit-button/submit-button.component";
import { inject } from '@angular/core';
import { Report } from '../../../core/models/DTOs/Report';
import { Input } from '@angular/core';
import { HelperService } from '../../../core/services/helper.service';
import { CommonModule } from '@angular/common';
import { EventEmitter } from '@angular/core';
@Component({
  selector: 'app-report-card',
  standalone: true,
  imports: [SubmitButtonComponent, CommonModule],
  templateUrl: './report-card.component.html',
  styleUrl: './report-card.component.css'
})
export class ReportCardComponent implements OnInit, OnChanges {
  @Input() report!: Report;
  @Output() reportPreviewActive = new EventEmitter<{active: boolean, report: Report}>();
  helperService = inject(HelperService);
  reportedUser!: string;
  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
  if (
    changes['report'] &&
    changes['report'].currentValue &&
    this.report.photo &&
    this.report.photo.user &&
    this.report.photo.user.userName
  ) {
    this.reportedUser = this.report.photo.user.userName;
  } else {
    this.reportedUser = '';
  }
}
}
