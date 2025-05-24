import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { NavBarComponent } from '../../shared/components/nav-bar/nav-bar.component';
import { TextInputComponent } from '../../shared/components/text-input/text-input.component';
import { SubmitButtonComponent } from '../../shared/components/submit-button/submit-button.component';

import { AuthService } from '../../core/services/auth.service';
import { AuthState } from '../../core/state/auth.state';
import { ToastService } from '../../core/services/toast.service';
import { User } from '../../core/models/DTOs/User';
import {ProfileUpdateRequest} from '../../core/models/Request/ProfileUpdateRequest';

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
  isEmailDisabled = true;
  usernameError = '';
  profileImgUrl = '';

  private destroy$ = new Subject<void>();
  private fb = inject(FormBuilder);
  private authState = inject(AuthState);
  private toastService = inject(ToastService);

  currentUser$ = this.authState.currentUser$;

  ngOnInit(): void {
    this.loadCurrentUser();
    this.initForm();
  }

  loadCurrentUser(): void {
    this.currentUser$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(user => {
      if (user) {
        this.populateForm(user);
      }
    });
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
      ]]
    });

    this.editProfileForm.get('email')?.disable();
  }

  private populateForm(user: User): void {
    this.editProfileForm.patchValue({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: user.userName
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      // Validacija tipa fajla
      if (!file.type.startsWith('image/')) {
        this.toastService.error('Please select a valid image file');
        return;
      }

      // Validacija veličine (maksimalno 5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.toastService.error('Image size must be less than 5MB');
        return;
      }

      // Kreiraj preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.profileImgUrl = e.target?.result as string;
      };
      reader.readAsDataURL(file);

      // TODO: Upload image to server
      this.uploadProfileImage(file);
    }
  }

  private uploadProfileImage(file: File): void {
    // TODO: Implementiraj upload logiku
    // const formData = new FormData();
    // formData.append('profileImage', file);
    // this.userService.uploadProfileImage(formData).subscribe(...)

    console.log('Uploading image:', file.name);
  }

  deleteImage(): void {
    this.profileImgUrl = '';
    // TODO: Pozovi API za brisanje slike
    this.toastService.success('Profile image removed');
  }

  saveProfile(): void {
    if (this.editProfileForm.invalid || this.editProfileForm.pristine) {
      this.toastService.error('Please make changes before saving');
      return;
    }

    this.isLoading = true;
    this.usernameError = '';

    const formValue = this.editProfileForm.value;
    const updateRequest: ProfileUpdateRequest = {
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      email: formValue.email,
      username: formValue.username
    };

    // TODO:
    // this.userService.updateProfile(updateRequest)
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe({
    //     next: (response) => {
    //       this.toastService.success('Profile updated successfully');
    //       this.authState.updateCurrentUser(response.data);
    //       this.editProfileForm.markAsPristine();
    //     },
    //     error: (error) => {
    //       if (error.status === 409 && error.error?.message?.includes('username')) {
    //         this.usernameError = 'Username is already taken';
    //       } else {
    //         this.toastService.error('Failed to update profile');
    //       }
    //     },
    //     complete: () => {
    //       this.isLoading = false;
    //     }
    //   });

    // Mock implementacija
    setTimeout(() => {
      this.toastService.success('Profile updated successfully');
      this.editProfileForm.markAsPristine();
      this.isLoading = false;
    }, 1000);
  }

  // Helper metoda za dobijanje kontrole
  getFormControl(controlName: string) {
    return this.editProfileForm.get(controlName);
  }

  // Helper metoda za validaciju
  isFieldInvalid(fieldName: string): boolean {
    const field = this.editProfileForm.get(fieldName);
    return !!(field && field.invalid && (field.touched || field.dirty));
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
