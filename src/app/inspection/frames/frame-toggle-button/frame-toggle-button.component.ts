import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-frame-toggle-button',
  imports: [],
  templateUrl: './frame-toggle-button.component.html',
  styleUrl: './frame-toggle-button.component.css'
})
export class FrameToggleButtonComponent {
  @Input() label: string = '';
  @Input() sideAValue: boolean | undefined;
  @Input() sideBValue: boolean | undefined;

  @Output() sideAChange = new EventEmitter<boolean>();
  @Output() sideBChange = new EventEmitter<boolean>();

  toggleSideA() {
    this.sideAValue = !this.sideAValue;
    this.sideAChange.emit(this.sideAValue);
  }

  toggleSideB() {
    this.sideBValue = !this.sideBValue;
    this.sideBChange.emit(this.sideBValue);
  }
}
