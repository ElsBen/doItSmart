import { Injectable } from '@angular/core';
import { DateService } from '../date-service/date.service';

@Injectable({
  providedIn: 'root',
})
export class DeadlineReminderService {
  constructor(private dateService: DateService) {}

  isDeadlineCloseToCurrentDate(deadline: string): string {
    const currentDate = this.getCurrentDate();
    const selectedDate = this.convertToUSFormat(deadline);
    currentDate.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);

    const timeDifference = this.calcTimeDifference(currentDate, selectedDate);

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
}
