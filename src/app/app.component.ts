import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { ToDoListsComponent } from './lists/to-do-lists.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, ToDoListsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'main-dir';
}
