import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DateService {
  constructor() {}

  createCurrentDate(): string {
    return new Date().toLocaleString('sv-SE').slice(0, 16);
  }

  convertToUSDateFormat(toConvertDate: string): string {
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

  isDeadlineCloseToCurrentDate(deadline: string): string {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    const selectedDate = new Date(this.convertToUSDateFormat(deadline));
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
