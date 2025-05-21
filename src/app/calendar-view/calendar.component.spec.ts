import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarComponent } from './calendar.component';

describe('CalendarComponent', () => {
  let component: CalendarComponent;
  let fixture: ComponentFixture<CalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarComponent],
      providers: [],
    }).compileComponents();

    fixture = TestBed.createComponent(CalendarComponent);
    component = fixture.componentInstance;
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
});
