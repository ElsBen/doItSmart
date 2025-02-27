import { NgModule, Pipe } from '@angular/core';
import { DateService } from '../../date-service/date.service';

@Pipe({
  name: 'shareDate',
})
export class ShareDateModule {
  constructor(private dateService: DateService) {}

  transform(
    date: string,
    format: 'short' | 'long' | 'deadline' = 'short'
  ): string {
    if (!date) return '';

    if (format === 'deadline')
      return this.dateService.isDeadlineCloseToCurrentDate(date);

    return format === 'short'
      ? this.dateService.convertCompletionDateShortView(date)
      : this.dateService.convertDateFullView(date);
  }
}
