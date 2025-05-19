import {Component, EventEmitter, Input, Output, Self} from '@angular/core';
import {FormControl, NgControl, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-password-input',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './password-input.component.html',
  styleUrl: './password-input.component.css'
})
export class PasswordInputComponent {
  @Input() label: string = 'Password';
  @Input() isVisible: boolean = false;
  @Input() showToggle: boolean = true;
  @Input() showStrengthIndicators: boolean = false;
  @Input() showPasswordMatchError: boolean = false;
  @Output() toggleVisibility = new EventEmitter<void>();

  constructor(@Self() public controlDir: NgControl) {
    this.controlDir.valueAccessor = this;
  }

  writeValue(obj: any): void { }
  registerOnChange(fn: any): void { }
  registerOnTouched(fn: any): void { }

  get control(): FormControl {
    return this.controlDir.control as FormControl;
  }

  onToggleVisibility(): void {
    this.toggleVisibility.emit();
  }

  get showError(): boolean {
    return (this.control?.touched || this.control?.dirty) &&
      (this.control?.invalid || this.showPasswordMatchError);
  }
}
