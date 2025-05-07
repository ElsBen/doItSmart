import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import {
  Events,
  Item,
  NgxResourceTimelineModule,
  NgxResourceTimelineService,
  Period,
  Section,
} from 'ngx-resource-timeline';
import moment from 'moment';
import 'moment/locale/de';

@Component({
  selector: 'app-calendar',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, NgxResourceTimelineModule],
  template: `
    <div class="calendar-container mt-5 p-md-5 p-sm-1 overflow-auto">
      <ngx-rt
        locale="de"
        headerFormat="DD.MM.YYYY"
        [items]="items"
        [periods]="periods"
        [sections]="sections"
        [events]="events"
        [showBusinessDayOnly]="false"
        [allowDragging]="true"
      >
      </ngx-rt>
    </div>
  `,

  styleUrl: 'calendar.component.css',
})
export class CalendarComponent {
  events: Events = new Events();
  periods: Period[] = [];
  sections: Section[] = [];
  items: Item[] = [];

  constructor(private service: NgxResourceTimelineService) {}

  ngOnInit() {
    moment.locale('de');
    this.periods = [
      {
        name: '1 Tag',
        timeFramePeriod: 60 * 6,
        timeFrameOverall: 60 * 24,
        classes: 'periods ',
        timeFrameHeaders: ['dd', 'HH'],
      },
      {
        name: '1 Woche',
        timeFrameHeaders: ['MMMM YYYY', 'D'],
        classes: 'periods',
        timeFrameOverall: 1440 * 7,
        timeFramePeriod: 1440,
      },
      {
        name: '2 Woche',
        timeFrameHeaders: ['MMMM YYYY', 'D'],
        classes: 'periods',
        timeFrameOverall: 1440 * 14,
        timeFramePeriod: 1440,
      },
    ];

    this.sections = [{ id: 1, name: 'nicht Zugewiesen' }];

    this.items = [
      {
        id: 1,
        sectionID: 1,
        name: 'Aufgabe 1',
        start: moment(),
        end: moment().add(1, 'days'),
        classes: 'item-1',
      },
      {
        id: 2,
        sectionID: 1,
        name: 'Aufgabe 2',
        start: moment(),
        end: moment().add(3, 'days'),
        classes: 'item-1',
      },
      {
        id: 3,
        sectionID: 1,
        name: 'Aufgabe 3',
        start: moment().add(1, 'days'),
        end: moment().add(6, 'days'),
        classes: 'item-1',
      },
      {
        id: 4,
        sectionID: 1,
        name: 'Aufgabe 4',
        start: moment().add(2, 'days'),
        end: moment().add(5, 'days'),
        classes: 'item-1',
      },
    ];
  }
}
