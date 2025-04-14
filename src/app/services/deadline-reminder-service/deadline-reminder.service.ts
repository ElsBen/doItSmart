import { Injectable } from '@angular/core';
import { DateService } from '../date-service/date.service';

@Injectable({
  providedIn: 'root',
})
export class DeadlineReminderService {
  constructor(private dateService: DateService) {}

  isDeadlineCloseToCurrentDate(deadline: string): string {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    const selectedDate = new Date(
      this.dateService.convertToUSDateFormat(deadline)
    );
    selectedDate.setHours(0, 0, 0, 0);

    const timeDifference = Math.ceil(
      (selectedDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
    );

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
}
