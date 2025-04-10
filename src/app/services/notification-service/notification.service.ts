import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor() {}
  messageSource = new BehaviorSubject<Array<string>>([]);
  currentMessage = this.messageSource.asObservable();

  COLOR_RED = 'red';
  COLOR_GREEN = 'green';

  showMessage(message: string, messageColor: string) {
    this.messageSource.next([message, messageColor]);

    setTimeout(() => {
      this.messageSource.next([]);
    }, 3500);
  }
}
