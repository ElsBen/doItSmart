import { Component, Injectable, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  animate,
  keyframes,
  style,
  transition,
  trigger,
} from '@angular/animations';

import { ShareDateModule } from '../shared-modules/share-date/share-date.module';
import { ToDoListService } from '../list-service/todoList.service';
import { NotificationComponent } from '../notification/notification.component';
import { NotificationService } from '../notification/notification-service/notification.service';

@Component({
  selector: 'app-to-do-lists',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ShareDateModule,
    NotificationComponent,
    RouterLink,
  ],
  templateUrl: './to-do-lists.component.html',
  styles: `
  .tab-links{
    cursor: pointer;
  }
  `,
  animations: [
    trigger('list', [
      transition(
        'void => *',
        animate(
          500,
          keyframes([
            style({
              transform: 'translateX(-100px)',
              opacity: 0,
              offset: 0,
            }),
            style({
              transform: 'translateX(-30px)',
              opacity: 0.6,
              offset: 0.3,
            }),
            style({
              transform: 'translateX(-10px)',
              opacity: 0.8,
              offset: 0.7,
            }),
            style({
              transform: 'translateX(0)',
              opacity: 1,
              offset: 1,
            }),
          ])
        )
      ),
      transition('* => void', [
        animate(
          500,
          style({
            transform: 'translateX(-100%)',
            opacity: 0,
            offset: 1,
          })
        ),
      ]),
    ]),
  ],
})
@Injectable({
  providedIn: 'root',
})
export class ToDoListsComponent implements OnInit {
  toDoList: Array<any> = [];
  activeTab: string = 'active';

  form: FormGroup = new FormGroup({});

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private toDoListService: ToDoListService,
    private notificationService: NotificationService
  ) {}

  getTodoLists() {
    this.toDoList = this.toDoListService.toDoList;
  }

  onSubmit(list: any) {
    const entryIndex = this.toDoList.indexOf(list);
    const existSublist = this.toDoList[entryIndex].sublist;
    const newSublistEntry = this.form.value.subEntry;
    if (!newSublistEntry) return;

    if (existSublist) {
      if (existSublist.includes(newSublistEntry)) {
        this.notificationService.showMessage(
          'Der Eintrag ist schon vorhanden!',
          'red'
        );
        return;
      }
      this.toDoList[entryIndex].sublist?.push(newSublistEntry);
    } else if (!existSublist) {
      this.toDoList[entryIndex].sublist = [newSublistEntry];
    }

    this.toDoListService.saveEntrys();
    this.form.reset();
  }

  onEdit(list: any) {
    //multiplying with 1 avoids problems with null or undefined in add-entry
    const entryIndex = this.toDoListService.toDoList.indexOf(list);
    this.router.navigate(['create'], { queryParams: { i: entryIndex + 1 } });
  }

  onDelete(list: any) {
    const entryObject = this.toDoListService.toDoList;
    const entryIndex = entryObject.indexOf(list);

    entryObject.splice(entryIndex, 1);
    this.toDoListService.saveEntrys();
  }

  ngOnInit() {
    this.toDoListService.getSavedEntrys();
    this.getTodoLists();
    this.form = this.formBuilder.group({
      subEntry: this.formBuilder.control(null, [Validators.required]),
    });

    this.form.statusChanges.subscribe((entry) => {
      console.log(entry);
    });
  }
}
