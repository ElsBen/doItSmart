import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarComponent } from './calendar.component';
import { ToDoListService } from '../services/list-service/todoList.service';
import { NgxResourceTimelineService } from 'ngx-resource-timeline';
import moment from 'moment';

describe('CalendarComponent', () => {
  let component: CalendarComponent;
  let fixture: ComponentFixture<CalendarComponent>;
  let toDoListService: ToDoListService;
  let timelineService: NgxResourceTimelineService;

  const mockDateMoment = moment('2024-10-01T12:00:00');
  const mockDateString = mockDateMoment.format('YYYY-MM-DD, HH:mm:ss');

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

    component.items.push({
      id: 1,
      sectionID: 1,
      name: 'Test Item',
      start: mockDateMoment,
      end: mockDateMoment,
      classes: 'item-1 category-1',
    });

    toDoListService.toDoList.push({
      itemID: 1,
      sectionID: 1,
      name: 'Test Item',
      completionDate: mockDateString,
      creationDate: mockDateString,
    });
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('highlightActivePeriod', () => {
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
      fixture.detectChanges();

      const activeCount = Array.from(buttons).filter((b) => {
        return (b as HTMLElement).classList.contains('active-period');
      }).length;

      expect(activeCount).toBe(1);
      expect(spy).toHaveBeenCalledTimes(2);
    });
  });

  describe('addItem', () => {
    it('should correctly add all valid to-do items to the timeline', () => {
      const initialLength = component.items.length;
      const spy = spyOn(timelineService, 'itemPush').and.callThrough();

      for (let i = 0; i < 3; i++) {
        let entry = toDoListService.createObject(
          `Test Item ${i}`,
          mockDateString,
          mockDateString,
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
  });

  describe('categorizeItem', () => {
    it('should set initial category correctly', () => {
      const spy = spyOn(toDoListService, 'saveEntrys').and.callThrough();
      const item = component.items[0];
      component.categorizeItem(item);

      expect(spy).toHaveBeenCalled();
      expect(item.classes.split(' ')).toContain('category-1');
      expect(item.sectionID).toBe(1);
      expect(toDoListService.toDoList[0].sectionID).toBe(1);
    });

    it('should update category on section change', () => {
      const spy = spyOn(toDoListService, 'saveEntrys').and.callThrough();
      const item = component.items[0];
      item.sectionID = 2;
      component.categorizeItem(item);

      expect(spy).toHaveBeenCalled();
      expect(item.classes.split(' ')).toContain('category-2');
      expect(item.sectionID).toBe(2);
      expect(toDoListService.toDoList[0].sectionID).toBe(2);
    });
  });

  afterEach(() => {
    toDoListService.toDoList = [];
    component.items = [];
    toDoListService.saveEntrys();
  });
});
