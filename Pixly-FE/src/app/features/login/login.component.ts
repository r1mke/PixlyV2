import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {ToastService} from '../../core/services/toast.service';
import {CustomValidators} from '../../core/validators/custom-validator';
import {RegisterRequest} from '../../core/models/Request/RegisterRequest';
import {AuthService} from '../../core/services/auth.service';
import {SubmitButtonComponent} from '../../shared/components/submit-button/submit-button.component';
import {PasswordInputComponent} from '../../shared/components/password-input/password-input.component';
import {TextInputComponent} from '../../shared/components/text-input/text-input.component';
import {LoginRequest} from '../../core/models/Request/LoginRequest';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    SubmitButtonComponent,
    PasswordInputComponent,
    TextInputComponent,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  isLoading: boolean = false;
  emailError: string = '';
  usernameError: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService,
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.loginForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required,]],
    });

    this.loginForm.patchValue({
      firstName: 'Elmir',
      lastName: 'Mujkic',
      email: 'teampixly@gmail.com',
      password: 'Elmir123@',
      confirmPassword: 'Elmir123@'
    })
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

// Helper method to mark all controls as touched - works recursively for nested form groups
  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      control.markAsDirty();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  onSubmit(): void {
    this.markFormGroupTouched(this.loginForm);

    if (this.loginForm.valid && !this.emailError && !this.usernameError) {
      this.isLoading = true;

      const loginRequest: LoginRequest = this.loginForm.value;

      this.authService.login(loginRequest).subscribe({
        next: (response) => {
          this.toastService.success('Login successful!');
        },
        error: (error) => {
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
          this.router.navigate(['/home']);
        }
      });

    } else {
      this.toastService.error('Please fix the errors in the form before submitting.');
    }
  }
}
