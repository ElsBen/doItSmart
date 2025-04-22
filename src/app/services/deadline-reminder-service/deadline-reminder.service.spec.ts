import { TestBed } from '@angular/core/testing';

import { DeadlineReminderService } from './deadline-reminder.service';
import { DateService } from '../date-service/date.service';

describe('DeadlineReminderService', () => {
  let service: DeadlineReminderService;
  let dateService: DateService;

  function setTestDate(amountDays: number): string {
    const currentDate = new Date();
    const desiredDate = new Date().setDate(
      currentDate.getDate() + amountDays
    ) as unknown as string;
    return dateService.convertDateToLocalDate(desiredDate);
  }

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeadlineReminderService);
    dateService = TestBed.inject(DateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should trigger a notification when a deadline is approaching', () => {
    spyOn(service as any, 'getDisplayNotificationMessage');

    // 2 Tage in der Zukunft
    const deadline = setTestDate(2);
    const entryName = 'Test Entry';

    service.remindIfDeadlineApproaching(deadline, entryName);

    expect((service as any).getDisplayNotificationMessage).toHaveBeenCalledWith(
      `Der Termin für den Eintrag "${entryName}" rückt näher!`
    );
  });

  it('should not trigger a notification if the deadline is far away', () => {
    spyOn(service as any, 'getDisplayNotificationMessage');

    // Mehr als 2 Tage in der Zukunft
    const deadline = setTestDate(20);
    const entryName = 'Test Entry';

    service.remindIfDeadlineApproaching(deadline, entryName);

    expect(
      (service as any).getDisplayNotificationMessage
    ).not.toHaveBeenCalled();
  });
});
