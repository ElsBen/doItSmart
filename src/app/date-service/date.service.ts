import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DateService {
  constructor() {}

  createCurrentDate(): string {
    return new Date().toLocaleString('sv-SE').slice(0, 16);
  }

  convertToDatepickerFormat(toConvertDate: string): string {
    const date = toConvertDate.slice(-14, -3);
    const days = toConvertDate.split('.')[0];
    const month = toConvertDate.split('.')[1];
    return new Date(`${month}/${days}/${date}`).toLocaleString('sv-SE');
  }

  convertDateToLocalDate(selectedDate?: string): string {
    return selectedDate
      ? new Date(selectedDate).toLocaleString('de-DE')
      : new Date().toLocaleString('de-DE');
  }
  convertCompletionDateShortView(completionDate: string): string {
    return completionDate.slice(-20, -10);
  }

  convertDateFullView(fullViewDate: string): string {
    return fullViewDate.slice(-20, -3).replace('-', ', ');
  }
}
