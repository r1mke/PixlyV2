import {Component, Input} from '@angular/core';
import {CommonModule, NgClass} from '@angular/common';

@Component({
  selector: 'app-submit-button',
  standalone: true,
  imports: [
    NgClass,
    CommonModule
  ],
  templateUrl: './submit-button.component.html',
  styleUrl: './submit-button.component.css'
})
export class SubmitButtonComponent {
  @Input() text: string = 'Submit';
  @Input() isLoading: boolean = false;
  @Input() isDisabled: boolean = false;
  @Input() loadingText: string = 'Loading...';
  @Input() fullWidth: boolean = true;
  @Input() buttonType: 'submit' | 'button' = 'submit';
  @Input() icon: string = '';
  @Input() backGroundColor: string = '#02A388';
}
