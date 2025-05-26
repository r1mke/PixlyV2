import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tag-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tag-input.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TagInputComponent),
      multi: true
    }
  ]
})
export class TagInputComponent implements ControlValueAccessor {
  @Input() showLabel: boolean = false;
  @Input() label: string | undefined;
  @Input() type = 'text';
  @Input() isRequired = false;
  @Input() placeholder: string = '';
  
  @Output() tagAdded = new EventEmitter<string>();
  
  tags: string[] = [];
  inputValue: string = '';
  disabled = false;

  onChange = (_: any) => {};
  onTouched = () => {};

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && this.inputValue.trim()) {
      event.preventDefault();
      this.addTag(this.inputValue.trim());
      this.inputValue = '';
    }
  }

  addTag(tag: string): void {
    if (!this.tags.includes(tag)) {
      this.tags.push(tag);
      this.tagAdded.emit(tag);
      this.onChange(this.tags);
      this.onTouched();
    }
  }

  removeTag(tag: string): void {
    this.tags = this.tags.filter(t => t !== tag);
    this.onChange(this.tags);
    this.onTouched();
  }

  writeValue(tags: string[]): void {
    this.tags = tags || [];
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}