import { Routes } from '@angular/router';
import { ToDoListsComponent } from './lists/to-do-lists.component';
import { DetailViewComponent } from './detail/detail-view.component';

export const routes: Routes = [
  { path: '', redirectTo: '', pathMatch: 'full' },
  { path: 'lists', component: ToDoListsComponent },
  { path: 'detail', component: DetailViewComponent },
];
