import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { NavBarComponent } from '../../shared/components/nav-bar/nav-bar.component';
import { TextInputComponent } from '../../shared/components/text-input/text-input.component';
import { SubmitButtonComponent } from '../../shared/components/submit-button/submit-button.component';

import { AuthState } from '../../core/state/auth.state';
import { ToastService } from '../../core/services/toast.service';
import { User } from '../../core/models/DTOs/User';
import {UserService} from '../../core/services/user.service';
import {ApiResponse} from '../../core/models/Response/api-response';
import {LoadingService} from '../../core/services/loading.service';

@Component({
  selector: 'app-profile-settings',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    NavBarComponent,
    TextInputComponent,
    SubmitButtonComponent,
  ],
  templateUrl: './profile-settings.component.html',
  styleUrl: './profile-settings.component.css'
})
export class ProfileSettingsComponent implements OnInit, OnDestroy {
  editProfileForm!: FormGroup;
  isLoading = false;
  usernameError = '';
  profileImgUrl: string | null = null;
  removeProfilePicture = false;
  selectedImageFile: File | null = null;

  private destroy$ = new Subject<void>();
  private fb = inject(FormBuilder);
  private authState = inject(AuthState);
  private toastService = inject(ToastService);
  private userService = inject(UserService);
  private loadingService = inject(LoadingService);

  currentUser$ = this.authState.currentUser$;
  private userId: any;

  ngOnInit(): void {
    this.initForm();
    this.loadCurrentUser();
    this.checkToastMessage();
  }

  loadCurrentUser(): void {
    this.currentUser$.subscribe(user => {
      if (user) {
        this.populateForm(user);
        this.profileImgUrl = user.profilePictureUrl
        this.userId = user.id;
      }
    });
  }

  checkToastMessage(): void {
    const toastMessage = localStorage.getItem('showSuccessToast');
    if (toastMessage) {
      this.toastService.success(toastMessage);
      localStorage.removeItem('showSuccessToast');
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initForm(): void {
    this.editProfileForm = this.fb.group({
      firstName: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(20)
      ]],
      lastName: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(20)
      ]],
      email: ['', [Validators.required, Validators.email]],
      username: ['', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(20)
      ]],
    });

    this.editProfileForm.get('email')?.disable();
  }

  private populateForm(user: User): void {
    this.editProfileForm.patchValue({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: user.userName,
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      // File Validation
      if (!file.type.startsWith('image/')) {
        this.toastService.error('Please select a valid image file');
        return;
      }

      // SIze Validation
      if (file.size > 5 * 1024 * 1024) {
        this.toastService.error('Image size must be less than 5MB');
        return;
      }

      // Preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.profileImgUrl = e.target?.result as string;
      };
      reader.readAsDataURL(file);

      this.selectedImageFile = file;
      this.editProfileForm.markAsDirty();
    }
  }

  deleteImage(): void {
    this.profileImgUrl = null;
    this.selectedImageFile = null;
    this.removeProfilePicture = true;
    this.editProfileForm.markAsDirty();
    this.toastService.info('Profile image removed');
  }


  saveProfile(): void {
    const formValue = this.editProfileForm.value;
    const formData = new FormData();

    formData.append('FirstName', formValue.firstName);
    formData.append('LastName', formValue.lastName);
    formData.append('UserName', formValue.username);

    if (this.selectedImageFile) {
      formData.append('ProfilePictureUrl', this.selectedImageFile);
    }

    formData.append('RemoveProfilePicture', this.removeProfilePicture.toString());

    this.userService.updateUser(this.userId, formData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: ApiResponse<User>) => {},
        error: (error) => {},
        complete: () => {
          this.editProfileForm.markAsPristine();
          localStorage.setItem('showSuccessToast', 'Profile updated successfully');
          this.loadingService.showLoaderFor(1000);
          setTimeout(() => window.location.reload(), 1000);
        }
      });
  }

  // TODO:
  changePassword(): void {
    console.log('Navigate to change password');
  }

  // TODO:
  removeAccount(): void {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      console.log('Delete account');
    }
  }
}
