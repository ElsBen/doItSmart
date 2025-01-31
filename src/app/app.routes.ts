import { Routes } from '@angular/router';
import { ToDoListsComponent } from './lists/to-do-lists.component';
import { DetailViewComponent } from './detail/detail-view.component';
import { AddEntryComponent } from './add-entry/add-entry.component';

export const routes: Routes = [
  { path: '', redirectTo: 'lists', pathMatch: 'full' },
  { path: 'lists', component: ToDoListsComponent },
  { path: 'detail', component: DetailViewComponent },
  { path: 'create', component: AddEntryComponent },
];
