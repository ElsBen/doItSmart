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
import { ToDoListService } from '../services/list-service/todoList.service';
import { Entry } from '../models/entry.model';

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

  constructor(
    private timelineService: NgxResourceTimelineService,
    private toDoListService: ToDoListService
  ) {}

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

  addItem() {
    this.toDoListService.getSavedEntrys();

    const dateFormat = 'D.M.YYYY, HH:mm:ss';

    this.toDoListService.toDoList.forEach((entry) => {
      const completionDate = entry.completionDate;
      const creationDate = entry.creationDate;
      const itemID = entry.itemID || 0;

      this.timelineService.itemPush({
        id: itemID,
        sectionID: entry.sectionID,
        name: entry.name,
        start: moment(creationDate, dateFormat),
        end: moment(completionDate, dateFormat),
        classes: `item-1 category-${entry.sectionID}`,
      });
    });
  }

  categorizeItem(item: Item) {
    let entrySuitable = null;
    this.toDoListService.toDoList.forEach((entry) => {
      if (entry.itemID === item.id) {
        entry.sectionID = item.sectionID;
        entrySuitable = entry;
        this.toDoListService.saveEntrys();
        this.changeClassCategory(item, entrySuitable);
      }
    });
  }

  changeClassCategory(item: Item, entry: Entry) {
    const oldClassName = item.classes.split(' ')[1];
    const newClassName = `category-${item.sectionID}`;

    this.items.forEach((i) => {
      if (i.id === item.id) {
        i.classes = i.classes.replace(oldClassName, newClassName);
      }
    });
  }

  swipePreviousAndNext() {
    const calendar = document.querySelector('.calendar-container');
    const timeBtnElement = document.getElementsByClassName(
      'time-sch-time-container'
    );
    const previousBtn = timeBtnElement[0].children[2] as HTMLElement;
    const nextBtn = timeBtnElement[0].children[3] as HTMLElement;

    let startX: number = 0;
    let endX: number = 0;

    calendar?.addEventListener('touchstart', onTouchStart, { passive: true });
    calendar?.addEventListener('touchend', onTouchEnd, { passive: true });

    function onTouchStart(e: Event) {
      const touch = e as TouchEvent;
      startX = touch.changedTouches[0].clientX;
    }

    function onTouchEnd(e: Event) {
      const touch = e as TouchEvent;
      endX = touch.changedTouches[0].clientX;
      const diff = endX - startX;

      if (diff > 0) previousBtn.click();
      if (diff < 0) nextBtn.click();
    }
  }

  ngOnInit() {
    this.events.SectionClickEvent = (section) =>
      console.log('Section clicked:', section);
    this.events.ItemClicked = (item) => console.log('Item clicked:', item);
    this.events.ItemDropped = (item) => {
      console.log('Item dropped:', item);
      this.categorizeItem(item);
    };

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

    this.items = [];
  }

  ngAfterViewInit() {
    this.highlightActivePeriod();
    setTimeout(() => {
      this.addItem();
    }, 50);

    this.swipePreviousAndNext();
  }
}
