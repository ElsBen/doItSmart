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
  MESSAGE_PREDICTION_ERROR = 'Fehler bei der Vorhersage!';

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

  requestNotificationPermission(): void {
    if ('Notification' in window) {
      Notification.requestPermission().then((permission) => {
        console.log('Notification permission:', permission);
      });
    }
    this.registerServiceWorker();
  }

  registerServiceWorker(): void {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('ngsw-worker.js')
        .then((registration) => {
          console.log('Service Worker registriert:', registration);
        })
        .catch((error) => {
          console.error('Service Worker Registrierung fehlgeschlagen:', error);
        });
    } else {
      console.warn('Service Worker wird nicht unterstützt.');
    }
  }

  displayNotification(title: string, body: string) {
    if (Notification.permission === 'granted') {
      navigator.serviceWorker.getRegistration().then((registration) => {
        if (registration) {
          registration.showNotification(title, {
            body: body,
            icon: 'assets/icons/icon-192x192.png',
          });
        } else {
          console.error('Kein Service worker registriert.');
        }
      });
    } else {
      console.warn('Benachrichtigungen sind nicht erlaubt.');
    }
  }
}
