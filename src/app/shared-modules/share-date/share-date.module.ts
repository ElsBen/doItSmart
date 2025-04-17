import { NgModule, Pipe } from '@angular/core';
import { DateService } from '../../services/date-service/date.service';
import { DeadlineReminderService } from '../../services/deadline-reminder-service/deadline-reminder.service';

@Pipe({
  name: 'shareDate',
})
export class ShareDateModule {
  constructor(
    private dateService: DateService,
    private deadlineReminder: DeadlineReminderService
  ) {}

  transform(
    date: string,
    format: 'short' | 'long' | 'deadline' = 'short',
    entryName: string = ''
  ): string {
    if (!date) return '';

    if (format === 'deadline')
      return this.deadlineReminder.isDeadlineCloseToCurrentDate(
        date,
        entryName
      );

    return format === 'short'
      ? this.dateService.convertCompletionDateShortView(date)
      : this.dateService.convertDateFullView(date);
  }
}
