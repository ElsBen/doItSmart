import { Injectable } from '@angular/core';
import { DateService } from '../date-service/date.service';
import { NotificationService } from '../notification-service/notification.service';
import { RemindedEntry } from '../../models/reminded-entry.model';
import { Entry } from '../../models/entry.model';

@Injectable({
  providedIn: 'root',
})
export class DeadlineReminderService {
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
      return 'bg-secondary';
    } else if (timeDifference === 0) {
      return 'bg-danger';
    } else if (timeDifference <= 2) {
      return 'bg-warning';
    } else {
      return 'bg-success';
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

    if (difference <= 2 && difference >= 0 && !isRemindedEntry) {
      this.getDisplayNotificationMessage(
        `Der Termin für den Eintrag "${entryName}" rückt näher!`
      );
    } else if (
      diffMinutes <= 120 &&
      diffMinutes >= 0 &&
      isRemindedEntry &&
      !isRemindedEntry.hasOwnProperty('isReminded')
    ) {
      isRemindedEntry.isReminded = false;
      this.getDisplayNotificationMessage(
        `Es sind weniger als 2 Stunden für "${entryName}" übrig!`
      );
    } else if (
      difference < 0 &&
      isRemindedEntry &&
      !isRemindedEntry.isReminded
    ) {
      isRemindedEntry.isReminded = true;
      this.getDisplayNotificationMessage(
        `Der Termin "${entryName}" ist am "${deadline}" abgelaufen!`
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

  private addEntry(
    deadline: string,
    entryName: string,
    isRemindedEntry: RemindedEntry | undefined
  ) {
    // Hier prüfen die Anweisung funktioniert nicht richtig (Wert ist immer undefined)
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
    localStorage.setItem(
      'remindedEntries',
      JSON.stringify(this.remindedEntries)
    );
  }

  getSavedEntries() {
    const savedEntries = localStorage.getItem('remindedEntries');
    if (savedEntries) {
      this.remindedEntries = JSON.parse(savedEntries);
    }
  }

  private getDisplayNotificationMessage(message: string) {
    this.notificationService.requestNotificationPermission();
    this.notificationService.displayNotification('Deadline Reminder', message);
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
