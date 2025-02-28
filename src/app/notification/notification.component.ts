import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotificationService } from '../services/notification-service/notification.service';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="message" [class]="alertColor" role="alert">
      {{ message }}
    </div>
  `,
  styles: ``,
})
export class NotificationComponent {
  message: string | null = null;
  alertColor: string | null = null;

  constructor(private notificationService: NotificationService) {
    this.notificationService.currentMessage.subscribe((msg) => {
      this.message = msg[0];

      msg[1] === 'red'
        ? (this.alertColor = 'alert alert-danger')
        : (this.alertColor = 'alert alert-success');
    });
  }
}
