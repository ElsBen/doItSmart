import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular'; // must go before plugins
import { CalendarOptions } from '@fullcalendar/core/index.js';
import dayGridPlugin from '@fullcalendar/daygrid/index.js';

@Component({
  selector: 'app-calendar',
  imports: [CommonModule, FullCalendarModule],
  template: `
    <!-- <div class="m-4">
      <h1>Demo App</h1>
      <full-calendar [options]="calendarOptions"></full-calendar>
    </div> -->
    <full-calendar [options]="calendarOptions">
      <ng-template #eventContent let-arg>
        <b>{{ arg.timeText }}</b>
        <i>{{ arg.event.title }}</i>
      </ng-template>
    </full-calendar>
  `,
  styles: ``,
})
export class CalendarComponent {
  calendarVisible = signal(true);
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin],
    initialView: 'dayGridMonth',
    weekends: false,
    events: [{ title: 'Meeting', start: new Date() }],
  };
}
