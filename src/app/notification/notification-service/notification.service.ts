import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor() {}
  messageSource = new BehaviorSubject<object | null>(null);
  currentMessage = this.messageSource.asObservable();

  showMessage(message: string, messageColor: string) {
    this.messageSource.next({
      currMessage: message,
      currMessageColor: messageColor,
    });
    setTimeout(() => {
      this.messageSource.next(null);
    }, 3000);
  }
}
