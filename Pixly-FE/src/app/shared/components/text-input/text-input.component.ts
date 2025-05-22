import {Component, Input, Self} from '@angular/core';
import {FormControl, NgControl, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-text-input',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './text-input.component.html',
  styleUrl: './text-input.component.css'
})
export class TextInputComponent {
  @Input() label: string | undefined;
  @Input() type = 'text';
  @Input() isRequired = false;
  @Input() minLength: number | null = null;
  @Input() maxLength: number | null = null;
  @Input() placeholder: string = '';
  @Input() customError: string = '';

  constructor(@Self() public controlDir: NgControl) {
    this.controlDir.valueAccessor = this;
  }

  writeValue(obj: any): void { }
  registerOnChange(fn: any): void { }
  registerOnTouched(fn: any): void { }

  get control(): FormControl {
    return this.controlDir.control as FormControl;
  }

  // Gets only the first error message for display
  get errorMessage(): string {
    const errors = this.control?.errors;

    if (this.customError) {
      return this.customError;
    }

    if (errors) {
      if (errors['required']) return '&bull; &nbsp; Required';
      if (errors['email']) return '&bull; &nbsp; Please enter a valid email address';
      if (errors['minlength']) return `&bull; &nbsp; Minimum ${errors['minlength'].requiredLength} characters`;
      if (errors['maxlength']) return `&bull; &nbsp; Maximum ${errors['maxlength'].requiredLength} characters`;
      if (errors['pattern']) return '&bull; &nbsp; Invalid format';
    }

    return '';
  }
}
