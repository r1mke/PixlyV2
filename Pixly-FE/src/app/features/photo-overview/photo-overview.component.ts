import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { Subject,takeUntil } from 'rxjs';
import { NavBarComponent } from '../../shared/components/nav-bar/nav-bar.component';
import { PhotoService } from '../../core/services/photo.service';
import { AuthService } from '../../core/services/auth.service';
import { PhotoBasic } from '../../core/models/DTOs/PhotoBasic';
import { PhotoDetail } from '../../core/models/DTOs/PhotoDetail';
import { StripeService } from '../../core/services/stripe.service';
import { TagsShowComponent } from "../../shared/components/tags-show/tags-show.component";
import { Tag } from '../../core/models/DTOs/Tag';
import { CreateReportComponent } from "../../shared/components/create-report/create-report.component";
@Component({
  selector: 'app-photo-page',
  standalone: true,
  templateUrl: './photo-overview.component.html',
  styleUrls: ['./photo-overview.component.css'],
  imports: [NavBarComponent, CommonModule, TagsShowComponent, CreateReportComponent],
})
export class PhotoPageComponent implements OnInit, OnDestroy {
  photo!: PhotoDetail;
  currentUser: any = null;
  currentUserId : number = 0;
  profileUserId: number = 0;
  isOwnProfile: boolean = false;
  public isLoading: boolean = false;
  similarObject: string[] = [];
  private ngOnDestory = new Subject<void>();
  currentUrl:string = '';
  private onDestroy$ = new Subject<void>();
  photoTags : string[] = [];
  showReportModal: boolean = false;
  constructor(
    private photoService: PhotoService, 
    private route: ActivatedRoute, 
    private authService: AuthService, 
    private router: Router,
    private stripeService: StripeService,
    private location: Location,private cdr: ChangeDetectorRef) {}
    
  ngOnInit(): void {
    this.checkUrl();

     this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
    });

    if (!this.currentUser) {
      this.authService.getCurrentUser().subscribe({
        error: () => {
          console.error('Error fetching user');
        },
      });
    }
  }

  ngOnDestroy(): void {
    this.ngOnDestory.next();
    this.ngOnDestory.complete();
  }

  checkUrl(){
      this.route.url.pipe(takeUntil(this.ngOnDestory)).subscribe((segment) => {
        this.currentUrl = segment.map(segment => segment.path).join('/');
        this.getPhotoBySlug();
      })
    }

  goToSearchPage(tag: string): void {
    console.log("okkkk")
    this.router.navigate(["/public/search/photos"], { queryParams: { q: tag } });
  }

  goToProfile(): void {
    if (this.currentUser) {
      this.router.navigate([`/public/profile/user/${this.currentUser.username}`]);
    } else {
      this.router.navigate(['/auth/login']);
    }
  }

  goToAuthorProfile(): void {
    if (this.photo?.user) {
      this.router.navigate([`/public/profile/user/${this.photo.user.userName}`]);
    } else {
      console.error('No user associated with this photo');
    }
  }

  getPhotoBySlug(): void {
    const photoSlug = this.route.snapshot.paramMap.get('slug');
    if (!photoSlug) {
      console.error('No photo slug provided');
      return;
  }

  this.photoService.getPhotoBySlug(photoSlug).subscribe({
    next: (resp) => {
      this.photo = resp.data;
      this.photoTags = resp.data.photoTags.map(photoTag => photoTag.tag.name);
      this.checkIfOwnprofile();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    error: (error) => {
      console.error('Error fetching photo:', error);
      this.location.back();
    }});
  }

  private checkIfOwnprofile(): void{
    if(this.currentUser && this.currentUser.userId === this.profileUserId)
      this.isOwnProfile = true;
    else
      this.isOwnProfile = false; 
  }


  toggleLike(photo: PhotoDetail, event: Event) {
    event.stopPropagation();

    if (!photo.photoId) {
      return;
    }

    const wasLiked = photo.isCurrentUserLiked;
    photo.isCurrentUserLiked = !wasLiked;

    const action = wasLiked ?
      this.photoService.unlikePhoto(photo.photoId) :
      this.photoService.likePhoto(photo.photoId);

    action.pipe(takeUntil(this.onDestroy$)).subscribe({
      error: () => {
        photo.isCurrentUserLiked = wasLiked;
      }
    });
  }

  toggleBookmark(photo: PhotoDetail, event: Event) {
    if(this.currentUser)
      this.currentUserId = this.currentUser.userId;
    else 
      this.router.navigate(['auth/login']);

      event.stopPropagation();
      const action = photo.isCurrentUserSaved ? this.photoService.unsavePhoto(photo.photoId) : this.photoService.savePhoto(photo.photoId);
   
      action.subscribe({
        next: () => {
          photo.isCurrentUserLiked = !photo.isCurrentUserSaved;
          this.getPhotoBySlug();
        },
        error: (err) => {
          console.error('Error updating bookmark status:', err.error?.Message || err.message);
        },
      });
  }

  purchase() {
    if (this.photo) {
      this.isLoading = true;
      const amount = this.photo.price ?? 0;
      const currency = 'USD';
      const photoImage = this.photo.url;
      const photoDescription = this.photo.description ?? 'No description';
      const photoId = this.photo.photoId;
      this.stripeService.checkout(photoId, amount).subscribe({
        next: (response) => {
          this.stripeService.redirectToCheckout(response.sessionId);
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error creating checkout session:', error);
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }
  }

  closeReportModal(event: boolean): void {
    this.showReportModal = false;
  }

  openReportModal(): void {
    if(!this.currentUser) this.router.navigate(['/login'], { queryParams: { returnUrl: this.currentUrl }});
    this.showReportModal = true;
  }

}