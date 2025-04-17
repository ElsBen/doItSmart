import { Injectable } from '@angular/core';
import { DateService } from '../date-service/date.service';
import { NotificationService } from '../notification-service/notification.service';

@Injectable({
  providedIn: 'root',
})
export class DeadlineReminderService {
  constructor(
    private dateService: DateService,
    private notificationService: NotificationService
  ) {}

  isDeadlineCloseToCurrentDate(deadline: string, entryName: string): string {
    const currentDate = this.getCurrentDate();
    const selectedDate = this.convertToUSFormat(deadline);
    currentDate.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);

    const timeDifference = this.calcTimeDifference(currentDate, selectedDate);
    this.remindIfDeadlineApproaching(deadline, timeDifference, entryName);

    if (timeDifference < 0) {
      return 'bg-secondary';
    } else if (timeDifference === 0) {
      return 'bg-danger';
    } else if (timeDifference <= 2) {
      return 'bg-warning';
    } else {
      return 'bg-success';
    }
  }

  private getCurrentDate(): Date {
    return new Date();
  }

  private convertToUSFormat(date: string): Date {
    return new Date(this.dateService.convertToUSDateFormat(date));
  }

  private calcTimeDifference(currentDate: Date, selectedDate: Date): number {
    return Math.ceil(
      (selectedDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
    );
  }

  remindIfDeadlineApproaching(
    deadline: string,
    difference: number,
    entryName: string
  ) {
    if (difference <= 2 && difference >= 0) {
      this.getDisplayNotificationMessage(
        `Der Termin für den Eintrag "${entryName}" rückt näher!`
      );
    } else if (difference < 0) {
      this.getDisplayNotificationMessage(
        `Der Termin "${entryName}" ist am "${deadline}" abgelaufen!`
      );
    }
  }

  private getDisplayNotificationMessage(message: string) {
    this.notificationService.requestNotificationPermission();
    this.notificationService.displayNotification('Deadline Reminder', message);
  }
}
