import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor() {}
  messageSource = new BehaviorSubject<Array<string>>([]);
  currentMessage = this.messageSource.asObservable();

  // Message for the notification
  MESSAGE_SUCCESS = 'Ihr Eintrag wurde gesichert!';
  MESSAGE_EXIST = 'Der Eintrag ist schon vorhanden!';
  MESSAGE_EMPTY = 'Eingabefeld ist leer!';
  MESSAGE_ERROR = 'Ein Fehler ist aufgetreten!';

  // Colors for the message
  COLOR_RED = 'red';
  COLOR_GREEN = 'green';

  showMessage(message: string, messageColor: string) {
    this.messageSource.next([message, messageColor]);

    setTimeout(() => {
      this.messageSource.next([]);
    }, 3500);
  }

  checkInvalidOrExistMessage(entryType: boolean | undefined): string {
    try {
      const message = entryType ? this.MESSAGE_EMPTY : this.MESSAGE_EXIST;
      return message;
    } catch (error) {
      console.error(
        'Validierung in checkInvalidOrExistMessage fehlgeschlagen: ',
        error
      );
      return this.MESSAGE_ERROR;
    }
  }
}
