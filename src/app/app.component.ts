/*
 * Do It Smart App – (c) 2025 Benjamin Elsner
 * MIT License – siehe LICENSE-Datei im Root-Verzeichnis.
 */

import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'main-dir';
}
