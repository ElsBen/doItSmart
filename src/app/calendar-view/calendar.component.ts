import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CalendarWrapperModule } from './calendar-wrapper.module';
import { CalendarEvent, CalendarModule, CalendarView } from 'angular-calendar';

@Component({
  selector: 'app-calendar',
  imports: [CommonModule, CalendarWrapperModule, CalendarModule],
  template: `<div class="calendar-wrapper">
    <mwl-calendar-month-view
      [viewDate]="viewDate"
      [events]="events"
      [locale]="'de'"
    >
    </mwl-calendar-month-view>
  </div>`,
  styles: `
//   .calendar-wrapper {
//   max-width: 1000px;
//   height: 100%;
//   margin: 2rem auto;
//   padding: 1rem;
//   background: white;
//   border-radius: 8px;
//   box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
// }
  `,
})
export class CalendarComponent {
  view: CalendarView = CalendarView.Month;
  viewDate: Date = new Date();

  events: CalendarEvent[] = [
    {
      start: new Date(),
      title: 'Meine erste Aufgabe',
    },
  ];
}
