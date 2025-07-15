import { Component, OnInit, HostListener } from '@angular/core';
import { Observable } from 'rxjs';
import { Toast, ToastService } from '../../../core/services/toast.service';
import { AsyncPipe, CommonModule, NgSwitch } from '@angular/common';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [NgSwitch, AsyncPipe, CommonModule],
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css']
})
export class ToastComponent implements OnInit {
  toasts$: Observable<Toast[]>;
  private _isMobile = false;

  constructor(private toastService: ToastService) {
    this.toasts$ = this.toastService.toasts$;
  }

  ngOnInit(): void {
    this.checkMobile();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkMobile();
  }

  private checkMobile(): void {
    this._isMobile = window.innerWidth <= 768;
  }

  isMobile(): boolean {
    return this._isMobile;
  }

  removeToast(id: number): void {
    this.toastService.remove(id);
  }

  getIconClass(type: string): string {
    switch (type) {
      case 'success': return 'fas fa-check-circle';
      case 'error': return 'fas fa-exclamation-circle';
      case 'warning': return 'fas fa-exclamation-triangle';
      case 'info': return 'fas fa-info-circle';
      default: return 'fas fa-info-circle';
    }
  }

  getBackgroundClass(type: string): string {
    const baseClass = this.isMobile() ? 'mobile-toast' : '';
    switch (type) {
      case 'success': return `bg-success ${baseClass}`;
      case 'error': return `bg-danger ${baseClass}`;
      case 'warning': return `bg-warning ${baseClass}`;
      case 'info': return `bg-info ${baseClass}`;
      default: return `bg-info ${baseClass}`;
    }
  }

  getToastClasses(toast: Toast): string {
    let classes = `toast show ${this.getBackgroundClass(toast.type)}`;
    
    if (toast.autoDismiss && this.isMobile()) {
      classes += ' auto-dismiss';
    }
    
    return classes;
  }
}