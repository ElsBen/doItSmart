import { Component, Injectable, OnInit, TemplateRef } from '@angular/core';
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
import { ToDoListService } from '../services/list-service/todoList.service';
import { NotificationComponent } from '../notification/notification.component';
import { NotificationService } from '../services/notification-service/notification.service';
import { AutocompleteService } from '../services/autocomplete-service/autocomplete.service';
import { PredictionComponent } from '../prediction/prediction.component';

@Component({
  selector: 'app-to-do-lists',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ShareDateModule,
    NotificationComponent,
    RouterLink,
    PredictionComponent,
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

  predictionSubpoint: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private toDoListService: ToDoListService,
    private notificationService: NotificationService,
    private autoComplete: AutocompleteService
  ) {}

  getTodoLists() {
    this.toDoList = this.toDoListService.toDoList;
  }

  onSubmit(list: object) {
    const newSublistEntry = this.form.value.subpoint;

    if (!this.toDoListService.addSubEntry(list, newSublistEntry)) {
      const message = this.notificationService.checkInvalidOrExistMessage(
        this.form.get('subpoint')?.invalid
      );

      this.notificationService.showMessage(
        message,
        this.notificationService.COLOR_RED
      );
      return;
    }

    this.autoComplete.trainDataset(newSublistEntry, this.autoComplete.isTodo);
    this.form.reset();
    this.predictionSubpoint = '';
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

  getApplyPrediction() {
    try {
      const currentInput = this.form.get(this.toDoListService.FIELD_SUBPOINT);
      this.autoComplete.applyPrediction(currentInput);
      this.predictionSubpoint = '';
    } catch (error) {
      console.error(this.notificationService.MESSAGE_PREDICTION_ERROR, error);
      this.notificationService.showMessage(
        this.notificationService.MESSAGE_PREDICTION_ERROR,
        this.notificationService.COLOR_RED
      );
    }
  }

  ngOnInit() {
    this.toDoListService.getSavedEntrys();
    this.getTodoLists();
    this.form = this.formBuilder.group({
      subpoint: this.formBuilder.control(null, [Validators.required]),
    });

    this.form
      .get(this.toDoListService.FIELD_SUBPOINT)
      ?.valueChanges.subscribe((entry) => {
        this.predictionSubpoint = this.autoComplete.predictionSubpoint;
        this.autoComplete.handleInputPrediction(entry, false);
      });
  }
}
