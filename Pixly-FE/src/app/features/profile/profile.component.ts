import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NavBarComponent } from '../../shared/components/nav-bar/nav-bar.component';
import { GalleryComponent } from '../../shared/components/gallery/gallery.component';
import { UserService } from '../../core/services/user.service';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/models/DTOs/User';


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink, NavBarComponent, GalleryComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})

export class ProfileComponent implements OnInit {
  currentUser: User | null = null;
  profileUser: User | null = null;
  isOwnProfile: boolean = false;
  username: string | null = null;
  activeTabEvent: string = 'Gallery';
  navItems = [
    { label: 'Gallery', active: true },
    { label: 'Collections', active: false },
    { label: 'Liked', active: false },
    { label: 'AI', active: false },
  ];

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.username = params.get('username');
      if (this.username) this.getUserProfile();
    });
    this.getCurrentUser();

    // this.route.url.subscribe(urlSegments => {
    //   this.updateActiveTab(urlSegments);
    // });
  }
  
  getCurrentUser(): void {
    this.authService.currentUser$.subscribe({
      next: (res) => {
        this.currentUser = res;
        if (this.profileUser) this.checkIfOwnProfile();
      },
      error: () => {},
    });
  }

  getUserProfile(): void {
    if (this.username) {
      this.userService.getUserByUsername(this.username!).subscribe({
        next: (resp) => {
          this.profileUser = Array.isArray(resp.data) ? resp.data[0] : resp.data;
          if (this.currentUser) this.checkIfOwnProfile();
        }
      });
    }
  }
  
  private checkIfOwnProfile(): void {
    if (this.currentUser && this.profileUser)
      this.isOwnProfile = this.currentUser.userName === this.profileUser.userName;
  }

  private updateActiveTab(urlSegments: any[]): void {
    this.navItems.forEach(nav => nav.active = false);

    if (urlSegments.some(segment => segment.path === 'liked')) {
      this.navItems[2].active = true;
    } 
    else if (urlSegments.some(segment => segment.path === 'gallery')) {
      this.navItems[0].active = true;
    }
    else 
    this.navItems[0].active = true; 
  }
  

  public setActive(item: any, event: Event): void {

    event.preventDefault();
    console.log(item);
    this.navItems.forEach((nav) => (nav.active = false));
    item.active = true;
    for(let i=0; i<this.navItems.length;i++){
      if(this.navItems[i].label === item.label)
      {
        this.navItems[i].active = true
        this.activeTabEvent = item.label;
      
      }
    }
  }


}

