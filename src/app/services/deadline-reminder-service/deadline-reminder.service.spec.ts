import { TestBed } from '@angular/core/testing';

import { DeadlineReminderService } from './deadline-reminder.service';

describe('DeadlineReminderService', () => {
  let service: DeadlineReminderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeadlineReminderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should trigger a notification when a deadline is approaching', () => {
    spyOn(service as any, 'getDisplayNotificationMessage');

    // 2 Tage in der Zukunft
    const deadline = '23.4.2025, 10:00:00';
    const entryName = 'Test Entry';

    service.remindIfDeadlineApproaching(deadline, entryName);

    expect((service as any).getDisplayNotificationMessage).toHaveBeenCalledWith(
      `Der Termin für den Eintrag "${entryName}" rückt näher!`
    );
  });

  it('should not trigger a notification if the deadline is far away', () => {
    spyOn(service as any, 'getDisplayNotificationMessage');

    // Mehr als 2 Tage in der Zukunft
    const deadline = '1.5.2026, 10:00:00';
    const entryName = 'Test Entry';

    service.remindIfDeadlineApproaching(deadline, entryName);

    expect(
      (service as any).getDisplayNotificationMessage
    ).not.toHaveBeenCalled();
  });
});
