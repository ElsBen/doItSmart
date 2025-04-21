import { Injectable } from '@angular/core';
import { DateService } from '../date-service/date.service';
import { NotificationService } from '../notification-service/notification.service';
import { RemindedEntry } from '../../models/reminded-entry.model';
import { Entry } from '../../models/entry.model';

@Injectable({
  providedIn: 'root',
})
export class DeadlineReminderService {
  LOCAL_STORAGE_KEY = 'remindedEntries';
  NOTIFICATION_TITLE = 'Deadline Reminder';
  BG_CLASSES = {
    secondary: 'bg-secondary',
    danger: 'bg-danger',
    warning: 'bg-warning',
    success: 'bg-success',
  };

  private remindedEntries: RemindedEntry[] = [];

  constructor(
    private dateService: DateService,
    private notificationService: NotificationService
  ) {}

  isDeadlineCloseToCurrentDate(deadline: string, entryName: string): string {
    const currentDate = this.getCurrentDate();
    const selectedDate = this.convertToUSFormat(deadline);
    currentDate.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);

    const timeDifference = this.calcTimeDifferenceDays(
      currentDate,
      selectedDate
    );
    this.remindIfDeadlineApproaching(deadline, entryName);

    if (timeDifference < 0) {
      return this.BG_CLASSES.secondary;
    } else if (timeDifference === 0) {
      return this.BG_CLASSES.danger;
    } else if (timeDifference <= 2) {
      return this.BG_CLASSES.warning;
    } else {
      return this.BG_CLASSES.success;
    }
  }

  private getCurrentDate(): Date {
    return new Date();
  }

  private convertToUSFormat(date: string): Date {
    return new Date(this.dateService.convertToUSDateFormat(date));
  }

  private calcTimeDifferenceDays(
    currentDate: Date,
    selectedDate: Date
  ): number {
    return Math.ceil(
      (selectedDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
    );
  }

  private calcTimeDifferenceMinutes(
    currentDate: Date,
    selectedDate: Date
  ): number {
    const diffMs = selectedDate.getTime() - currentDate.getTime();
    return diffMs / 1000 / 60;
  }

  remindIfDeadlineApproaching(deadline: string, entryName: string) {
    const currentDate = this.getCurrentDate();
    const selectedDate = this.convertToUSFormat(deadline);

    const diffMinutes = this.calcTimeDifferenceMinutes(
      currentDate,
      selectedDate
    );

    const difference = this.calcTimeDifferenceDays(currentDate, selectedDate);
    const isRemindedEntry = this.checkForExistingEntry(deadline, entryName);

    this.handleDeadlineApproaching(difference, entryName, isRemindedEntry);
    if (isRemindedEntry) {
      this.handleShortTimeRemaining(diffMinutes, entryName, isRemindedEntry);
      this.handleDeadlineExpired(
        difference,
        deadline,
        entryName,
        isRemindedEntry
      );
    }
    if (!isRemindedEntry) {
      this.addEntry(deadline, entryName, isRemindedEntry);
    }
    this.saveEntries();
  }

  private checkForExistingEntry(
    deadline: string,
    entryName: string
  ): RemindedEntry | undefined {
    return this.remindedEntries.find((e) => {
      return e.nameEntry === entryName && e.deadline === deadline;
    });
  }

  private handleDeadlineApproaching(
    difference: number,
    entryName: string,
    isRemindedEntry: RemindedEntry | undefined
  ) {
    if (difference <= 2 && difference >= 0 && !isRemindedEntry) {
      this.getDisplayNotificationMessage(
        `Der Termin für den Eintrag "${entryName}" rückt näher!`
      );
    }
  }

  private handleShortTimeRemaining(
    diffMinutes: number,
    entryName: string,
    isRemindedEntry: RemindedEntry
  ) {
    if (
      diffMinutes <= 120 &&
      diffMinutes >= 0 &&
      !isRemindedEntry.isReminded &&
      !isRemindedEntry.hasOwnProperty('isReminded')
    ) {
      isRemindedEntry.isReminded = false;
      this.getDisplayNotificationMessage(
        `Es sind weniger als 2 Stunden für "${entryName}" übrig!`
      );
    }
  }

  private handleDeadlineExpired(
    difference: number,
    deadline: string,
    entryName: string,
    isRemindedEntry: RemindedEntry
  ) {
    if (difference < 0 && !isRemindedEntry.isReminded) {
      isRemindedEntry.isReminded = true;
      this.getDisplayNotificationMessage(
        `Der Termin "${entryName}" ist am "${deadline}" abgelaufen!`
      );
    }
  }

  private addEntry(
    deadline: string,
    entryName: string,
    isRemindedEntry: RemindedEntry | undefined
  ) {
    if (isRemindedEntry?.nameEntry !== entryName) {
      this.remindedEntries.push({
        nameEntry: entryName,
        deadline: deadline,
      });
    } else if (isRemindedEntry.nameEntry === entryName) {
      isRemindedEntry.deadline = deadline;
    }
    this.saveEntries();
  }

  private saveEntries() {
    try {
      localStorage.setItem(
        this.LOCAL_STORAGE_KEY,
        JSON.stringify(this.remindedEntries)
      );
    } catch (error) {
      console.error('Error saving reminded entries to localStorage:', error);
    }
  }

  getSavedEntries() {
    try {
      const savedEntries = localStorage.getItem(this.LOCAL_STORAGE_KEY);
      if (savedEntries) {
        this.remindedEntries = JSON.parse(savedEntries);
      }
    } catch (error) {
      console.error('Error parsing reminded entries from localStorage:', error);
    }
  }

  private getDisplayNotificationMessage(message: string) {
    this.notificationService.requestNotificationPermission();
    this.notificationService.displayNotification(
      this.NOTIFICATION_TITLE,
      message
    );
  }

  reminderCycle() {
    this.remindedEntries.forEach((entry) => {
      this.remindIfDeadlineApproaching(entry.deadline, entry.nameEntry);
    });
  }

  removeRemindedEntry(listName: string) {
    this.remindedEntries = this.remindedEntries.filter(
      (entry) => entry.nameEntry !== listName
    );
    this.saveEntries();
  }

  changeRemindedEntry(oldEntry: Entry, newEntry: Entry) {
    const deadline = oldEntry.completionDate;
    const entryName = oldEntry.name;
    const remindedEntry = this.checkForExistingEntry(deadline, entryName);
    if (remindedEntry) {
      remindedEntry.deadline = newEntry.completionDate;
      remindedEntry.nameEntry = newEntry.name;
    }
    this.saveEntries();
  }
}
