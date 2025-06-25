import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private activeRequests = 0;
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private showTimeout: any;
  private hideTimeout: any;
  private readonly MIN_LOADING_TIME = 500;
  private readonly SHOW_DELAY = 200;

  public loading$ = this.loadingSubject.asObservable();

  addRequest(): void {
    this.activeRequests++;

    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = null;
    }

    if (this.activeRequests === 1 && !this.loadingSubject.value) {
      this.showTimeout = setTimeout(() => {
        if (this.activeRequests > 0) {
          this.loadingSubject.next(true);
        }
      }, this.SHOW_DELAY);
    }
  }

  removeRequest(): void {
    this.activeRequests--;

    if (this.activeRequests <= 0) {
      this.activeRequests = 0;

      if (this.showTimeout) {
        clearTimeout(this.showTimeout);
        this.showTimeout = null;
      }

      if (this.loadingSubject.value) {
        this.hideTimeout = setTimeout(() => {
          if (this.activeRequests === 0) {
            this.loadingSubject.next(false);
          }
        }, this.MIN_LOADING_TIME);
      } else {
        this.loadingSubject.next(false);
      }
    }
  }

  setLoading(loading: boolean): void {
    if (this.showTimeout) {
      clearTimeout(this.showTimeout);
      this.showTimeout = null;
    }
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = null;
    }

    this.loadingSubject.next(loading);
  }

  get isLoading(): boolean {
    return this.loadingSubject.value;
  }

  showLoaderFor(durationMs: number): void {
    if (this.loadingSubject.value) return;

    this.setLoading(true);

    setTimeout(() => {
      this.setLoading(false);
    }, durationMs);
  }


  ngOnDestroy(): void {
    if (this.showTimeout) {
      clearTimeout(this.showTimeout);
    }
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
    }
  }
}
