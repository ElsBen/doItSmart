import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {
  Events,
  Item,
  NgxResourceTimelineModule,
  NgxResourceTimelineService,
  Period,
  Section,
} from 'ngx-resource-timeline';
import moment from 'moment';

@Component({
  selector: 'app-calendar',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, NgxResourceTimelineModule],
  template: `
    <div class="calendar-container mt-5 p-md-5 p-sm-1 overflow-auto">
      <ngx-rt
        locale="de"
        headerFormat="DD.MMM"
        [showHeaderTitle]="true"
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
export class CalendarComponent implements OnInit {
  events: Events = new Events();
  periods: Period[] = [];
  sections: Section[] = [];
  items: Item[] = [];

  constructor(private service: NgxResourceTimelineService) {}

  highlightActivePeriod() {
    const btns = document.querySelectorAll('.periods');

    // Add active class to the first button as starting point
    btns[0].classList.add('active-period');

    btns.forEach((e) => {
      e.addEventListener('click', (e) => {
        e.preventDefault();
        const target = e.target as HTMLElement;
        const parent = target.parentElement as HTMLElement;

        // Remove active class from all buttons and add to the clicked button
        parent.querySelectorAll('.periods').forEach((el) => {
          el.classList.remove('active-period');
        });
        target.classList.add('active-period');
      });
    });
  }

  ngOnInit() {
    this.periods = [
      {
        name: 'Tg.',
        timeFramePeriod: 60 * 6,
        timeFrameOverall: 60 * 24,
        classes: 'periods day',
        timeFrameHeaders: ['dd', 'HH'],
      },
      {
        name: '1 W.',
        timeFrameHeaders: ['MMMM YYYY', 'D'],
        classes: 'periods one-week',
        timeFrameOverall: 1440 * 7,
        timeFramePeriod: 1440,
      },
      {
        name: '2 W.',
        timeFrameHeaders: ['MMMM YYYY', 'D'],
        classes: 'periods two-weeks',
        timeFrameOverall: 1440 * 14,
        timeFramePeriod: 1440,
      },
    ];

    this.sections = [
      { id: 1, name: 'nicht Zugewiesen' },
      { id: 2, name: 'Nicht wichtig' },
      { id: 3, name: 'Nicht sehr wichtig' },
      { id: 4, name: 'Wichtig' },
      { id: 5, name: 'sehr wichtig' },
      { id: 6, name: 'extrem wichtig' },
    ];

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

  ngAfterViewInit() {
    this.highlightActivePeriod();
  }
}
