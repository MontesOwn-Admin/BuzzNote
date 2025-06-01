import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-alerts',
  imports: [],
  templateUrl: './alerts.component.html',
  styleUrl: './alerts.component.css'
})
export class AlertsComponent {
  @Input() error: string | null = null;
  @Input() message: string | null = null;
}
