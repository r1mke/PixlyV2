import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {ToastService} from '../../core/services/toast.service';
import {CustomValidators} from '../../core/validators/custom-validator';
import {RegisterRequest} from '../../core/models/DTOs/Request/RegisterRequest';
import {AuthService} from '../../core/services/auth.service';
import {SubmitButtonComponent} from '../../shared/components/submit-button/submit-button.component';
import {PasswordInputComponent} from '../../shared/components/password-input/password-input.component';
import {TextInputComponent} from '../../shared/components/text-input/text-input.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    SubmitButtonComponent,
    PasswordInputComponent,
    TextInputComponent,
    ReactiveFormsModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
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
    this.registerForm = this.fb.group({
      firstName: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
      lastName: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
      email: [null, [Validators.required, Validators.email]],
      password: [null, [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(64),
        CustomValidators.patternValidator(/\d/, { hasNumber: true }),
        CustomValidators.patternValidator(/[A-Z]/, { hasCapitalCase: true }),
        CustomValidators.patternValidator(/[a-z]/, { hasSmallCase: true }),
        CustomValidators.patternValidator(/[!@#$%^&*(),.?":{}|<>]/, { hasSpecialCharacters: true }),
      ]],
      confirmPassword: [null, Validators.required],
    }, { validators: CustomValidators.passwordMatchValidator });

    this.registerForm.patchValue({
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

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
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
    this.markFormGroupTouched(this.registerForm);

    if (this.registerForm.valid && !this.emailError && !this.usernameError) {
      this.isLoading = true;

      const registerRequest: RegisterRequest = this.registerForm.value;

      this.authService.register(registerRequest).subscribe({
        next: (response) => {
          this.toastService.success('Registration successful!');
          console.log(response);
        },
        error: (error) => {
          this.isLoading = false;
          // Error is handled globally in the interceptor
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
