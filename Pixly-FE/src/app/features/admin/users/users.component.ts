import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, ViewChild, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { AuthState } from '../../../core/state/auth.state';
import {LoadingService} from '../../../core/services/loading.service';
import { UserService } from '../../../core/services/user.service';
import { SearchService } from '../../../core/services/search.service';
import { inject } from '@angular/core';
import { takeUntil, distinctUntilChanged } from 'rxjs';
import { TotalCardComponent } from '../../../shared/components/total-card/total-card.component'
import { UserSearchRequest } from '../../../core/models/SearchRequest/UserSearchRequest';
import { User } from '../../../core/models/DTOs/User';
@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, TotalCardComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() emptyStateMessage: string = 'No photos found';
  @ViewChild('sentinel') sentinel!: ElementRef;
  
  private onDestroy$ = new Subject<void>();
  private intersectionObserver?: IntersectionObserver;
  authState = inject(AuthState);
  searchService = inject(SearchService);
  userService = inject(UserService);
  loadingService = inject(LoadingService);

  ngOnInit(): void {
      this.userService.initialize();
      setTimeout(() => {
      const defaultSearchRequest: Partial<UserSearchRequest> = {
        pageNumber: 1,
        pageSize: 10
      };
      this.loadUsers(defaultSearchRequest);
    }, 300);
  }

   ngAfterViewInit(): void {
    this.setupIntersectionObserver();
  }

  loadUsers(searchObject: Partial<UserSearchRequest>): void {
    this.userService.getUsers(searchObject).pipe(takeUntil(this.onDestroy$)).subscribe();
  }
  
  loadMore(): void {
    if (this.userService.isLoading()) return;
      this.userService.loadMoreUsers().pipe(takeUntil(this.onDestroy$)).subscribe();
  }
  
  trackByUserId(index: number, user: User): string {
    return user.email;
  }
  
  setupIntersectionObserver(): void {
    if (!this.sentinel || !('IntersectionObserver' in window)) {
      console.log('Sentinel element missing or IntersectionObserver not supported');
      return;
    }
  
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
  
    this.intersectionObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !this.userService.isLoading()) {
        this.loadMore();
      }
    }, {
      root: null,
      rootMargin: '30px',
      threshold: 0
    });
    this.intersectionObserver.observe(this.sentinel.nativeElement);
  }

  /* getRoleClass(roles: string[]): string {
    if (roles.includes('Admin')) return 'role-admin';
    if (roles.includes('Moderator')) return 'role-moderator';
    return 'role-user';
  }
  
  getStatusClass(user: User): string {
    if (!user.isActive) return 'status-blocked';
    if (!user.emailConfirmed) return 'status-pending';
    return 'status-active';
  } */

  getStatusText(user: User): string {
    if (!user.isActive) return 'Blocked';
    if (!user.emailConfirmed) return 'Pending';
    return 'Active';
  }

  blockUser(user: User): void {
    // TODO: Implement block user functionality
    if (user.isActive) {
      user.isActive = false;
      user.state = 'Blocked';
    } else {
      user.isActive = true;
      user.state = 'Active';
    }
  }

   makeAdmin(user: User): void {
    // TODO: Implement make admin functionality
    if (!user.roles.includes('Admin')) {
      user.roles.push('Admin');
    } else {
      user.roles = user.roles.filter(role => role !== 'Admin');
      if (user.roles.length === 0) {
        user.roles.push('User');
      }
    }
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();

    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
  }
}
