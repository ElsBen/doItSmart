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
    const yearTime = toConvertDate.slice(-14, -3);
    const days = toConvertDate.split('.')[0];
    const month = toConvertDate.split('.')[1];
    return new Date(`${month}/${days}/${yearTime}`).toLocaleString('sv-SE');
  }

  convertCurrentDateToLocalDate(): string {
    return new Date().toLocaleString('de-DE');
  }

  convertSelectedDateToLocalDate(selectedDate: string): string {
    return new Date(selectedDate).toLocaleString('de-DE');
  }
}
