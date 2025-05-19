import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {Toast, ToastService} from '../../../core/services/toast.service';
import {AsyncPipe, CommonModule, NgSwitch} from '@angular/common';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [
    NgSwitch,
    AsyncPipe, CommonModule
  ],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css'
})
export class ToastComponent implements OnInit {
  toasts$: Observable<Toast[]>;

  constructor(private toastService: ToastService) {
    this.toasts$ = this.toastService.toasts$;
  }

  ngOnInit(): void {}

  removeToast(id: number): void {
    this.toastService.remove(id);
  }

  getIconClass(type: string): string {
    switch (type) {
      case 'success': return 'bi bi-check-circle-fill';
      case 'error': return 'bi bi-x-circle-fill';
      case 'warning': return 'bi bi-exclamation-triangle-fill';
      case 'info': return 'bi bi-info-circle-fill';
      default: return 'bi bi-info-circle-fill';
    }
  }

  getBackgroundClass(type: string): string {
    switch (type) {
      case 'success': return 'bg-success';
      case 'error': return 'bg-danger';
      case 'warning': return 'bg-warning';
      case 'info': return 'bg-info';
      default: return 'bg-info';
    }
  }
}
