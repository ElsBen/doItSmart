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
});
