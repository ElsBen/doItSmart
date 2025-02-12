import { NgModule, Pipe } from '@angular/core';
import { DateService } from '../../date-service/date.service';

@Pipe({
  name: 'convertDate',
})
export class ShareDateModule {
  constructor(private dateService: DateService) {}

  transform(date: string, format: 'short' | 'long' = 'short'): string {
    if (!date) return '';
    return format === 'short'
      ? this.dateService.convertCompletionDateShortView(date)
      : this.dateService.convertDateFullView(date);
  }
}
