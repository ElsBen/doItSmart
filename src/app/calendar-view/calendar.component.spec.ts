import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarComponent } from './calendar.component';
import { ToDoListService } from '../services/list-service/todoList.service';
import { NgxResourceTimelineService } from 'ngx-resource-timeline';

describe('CalendarComponent', () => {
  let component: CalendarComponent;
  let fixture: ComponentFixture<CalendarComponent>;
  let toDoListService: ToDoListService;
  let timelineService: NgxResourceTimelineService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarComponent],
      providers: [ToDoListService, NgxResourceTimelineService],
    }).compileComponents();

    fixture = TestBed.createComponent(CalendarComponent);
    component = fixture.componentInstance;
    toDoListService = TestBed.inject(ToDoListService);
    timelineService = TestBed.inject(NgxResourceTimelineService);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should add active-period class to the clicked button', () => {
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('button.periods');

    expect(buttons[0].classList.contains('active-period')).toBeTruthy();
    expect(buttons[1].classList.contains('active-period')).toBeFalsy();
    expect(buttons[2].classList.contains('active-period')).toBeFalsy();

    buttons[1].click();

    expect(buttons[0].classList.contains('active-period')).toBeFalsy();
    expect(buttons[1].classList.contains('active-period')).toBeTruthy();
    expect(buttons[2].classList.contains('active-period')).toBeFalsy();
  });

  it('should attach event listener only once', () => {
    const spy = spyOn(component, 'highlightActivePeriod').and.callThrough();

    component.highlightActivePeriod();
    component.highlightActivePeriod();
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('button.periods');
    buttons[1].click();
    buttons[1].click();

    const activeCount = Array.from(buttons).filter((b) => {
      return (b as HTMLElement).classList.contains('active-period');
    }).length;

    expect(activeCount).toBe(1);
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('should correctly add all valid to-do items to the timeline', () => {
    const initialLength = component.items.length;
    const spy = spyOn(timelineService, 'itemPush').and.callThrough();

    for (let i = 0; i < 3; i++) {
      let entry = toDoListService.createObject(
        `Test Item ${i}`,
        '2023-10-01, 12:00:00',
        '2023-10-01, 12:00:00',
        1
      );

      toDoListService.toDoList.push(entry);
    }
    toDoListService.saveEntrys();

    component.addItem();

    expect(spy).toHaveBeenCalledTimes(toDoListService.toDoList.length);
    expect(component.items.length).toBeGreaterThan(initialLength);
    toDoListService.toDoList.forEach((entry, i) => {
      expect(spy.calls.argsFor(i)[0]).toEqual(
        jasmine.objectContaining({
          id: entry.itemID,
          sectionID: entry.sectionID,
          name: entry.name,
          start: jasmine.any(Object),
          end: jasmine.any(Object),
          classes: jasmine.stringMatching(/item-\d+ category-1/),
        })
      );
    });
  });

  afterEach(() => {
    toDoListService.toDoList = [];
    toDoListService.saveEntrys();
  });
});
