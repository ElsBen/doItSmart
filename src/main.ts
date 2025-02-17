/*
 * Do It Smart App – (c) 2025 Benjamin Elsner
 * MIT License – siehe LICENSE-Datei im Root-Verzeichnis.
 */

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err)
);
