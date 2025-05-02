import { Routes } from '@angular/router';
import { ToDoListsComponent } from './lists/to-do-lists.component';
import { AddEntryComponent } from './add-entry/add-entry.component';
import { AboutComponent } from './about/about.component';
import { CalendarComponent } from './calendar-view/calendar.component';

export const routes: Routes = [
  { path: '', redirectTo: 'lists', pathMatch: 'full' },
  { path: 'lists', component: ToDoListsComponent },
  { path: 'create', component: AddEntryComponent },
  { path: 'calendar', component: CalendarComponent },
  { path: 'about', component: AboutComponent },
  { path: '**', redirectTo: 'lists' },
];
