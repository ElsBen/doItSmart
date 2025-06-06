import { CommonModule } from '@angular/common';
import { Component, Injectable, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormGroup,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { Entry, SubEntry } from '../models/entry.model';
import { ToDoListService } from '../services/list-service/todoList.service';
import { NotificationService } from '../services/notification-service/notification.service';
import { AutocompleteService } from '../services/autocomplete-service/autocomplete.service';
import { DateService } from '../services/date-service/date.service';

import { NotificationComponent } from '../notification/notification.component';
import { PredictionComponent } from '../prediction/prediction.component';
import { DeadlineReminderService } from '../services/deadline-reminder-service/deadline-reminder.service';

@Injectable({
  providedIn: 'root',
})
@Component({
  selector: 'app-add-entry',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    NotificationComponent,
    PredictionComponent,
  ],
  templateUrl: './add-entry.component.html',
  styles: ``,
})
export class AddEntryComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  subPoints: SubEntry[] = [];

  queryParam: number | null = null;
  editEntry: Entry | null = null;
  contentSubmitBtn: string = '';

  predictionTodo: string = '';
  predictionSubpoint: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private dateService: DateService,
    private toDoListService: ToDoListService,
    private notificationService: NotificationService,
    private autoComplete: AutocompleteService,
    private deadlineReminderService: DeadlineReminderService
  ) {}

  onSubmit() {
    if (this.isFormInvalid()) return;

    const newEntry: Entry = this.createNewEntry();
    this.saveEntry(newEntry);
    this.onClear();
    this.notificationService.showMessage(
      this.notificationService.MESSAGE_SUCCESS,
      this.notificationService.COLOR_GREEN
    );
  }

  private isFormInvalid(): boolean {
    // Check if form is invalid or if the entry already exists or is empty
    if (
      this.form.invalid ||
      (this.isDuplicateOrEmptyEntry(this.form.value.todo) && !this.editEntry)
    ) {
      const message = this.notificationService.checkInvalidOrExistMessage(
        this.form.invalid
      );

      this.notificationService.showMessage(
        message,
        this.notificationService.COLOR_RED
      );
      return true;
    }
    return false;
  }

  private createNewEntry(): Entry {
    const nameTodoForm: string = this.form.value.todo;
    const completionDate = this.dateService.convertDateToLocalDate(
      this.form.value.completionDate
    );

    const creationTime = this.dateService.convertDateToLocalDate();
    const hasSubPoints: boolean = this.subPoints.length > 0;

    return this.toDoListService.createObject(
      nameTodoForm,
      completionDate,
      creationTime,
      1,
      hasSubPoints ? this.subPoints : undefined
    );
  }

  private saveEntry(newEntry: Entry): void {
    const toDoList: Array<Entry> = this.toDoListService.toDoList;
    if (this.queryParam !== null) {
      const oldEntry = toDoList[this.queryParam - 1];
      toDoList[this.queryParam - 1] = newEntry;
      this.deadlineReminderService.changeRemindedEntry(oldEntry, newEntry);
      // hier für die reminder Einträge auch einen change ausführen
    } else {
      toDoList.push(newEntry);
    }
    this.toDoListService.saveEntrys();
    this.autoComplete.trainDataset(newEntry.name, this.autoComplete.isTodo);
  }

  private isDuplicateOrEmptyEntry(todo: string): boolean {
    return this.toDoListService.toDoList.some((entry) => entry.name === todo);
  }

  addSubPoint() {
    const subPointValue: string = this.form.value.subpoint;
    const isSubPoint: boolean = this.subPoints.some(
      (todoSubp) => todoSubp.name === subPointValue
    );
    const newSubPoint: SubEntry = { name: subPointValue, done: false };

    !isSubPoint && subPointValue
      ? this.subPoints.push(newSubPoint)
      : this.notificationService.showMessage(
          this.notificationService.MESSAGE_EXIST,
          this.notificationService.COLOR_RED
        );
    this.autoComplete.trainDataset(subPointValue, this.autoComplete.isTodo);
    this.form.get('subpoint')!.reset();
    this.predictionSubpoint = this.predictionTodo = '';
    this.autoComplete.isTodo = true;
  }

  deleteSubpoint(subpoint: SubEntry) {
    const findEntry = this.subPoints.indexOf(subpoint);
    this.subPoints.splice(findEntry, 1);
  }

  displayCurrentDate() {
    const getComplDate = this.form.get('completionDate');

    if (!this.editEntry) {
      const currentDate = this.dateService.createCurrentDate();
      return getComplDate?.setValue(currentDate);
    } else if (this.editEntry) {
      let toConvertDate = this.editEntry.completionDate;
      const convertedDate =
        this.dateService.convertToUSDateFormat(toConvertDate);
      return getComplDate?.setValue(convertedDate);
    }
  }

  onClear() {
    this.editEntry = null;
    this.subPoints = [];
    this.queryParam = null;
    this.form.reset();
    this.displayCurrentDate();
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { ['i']: null },
      queryParamsHandling: 'merge',
    });
  }

  getApplyPrediction() {
    const currentInput = this.autoComplete.isTodo
      ? this.form.get(this.toDoListService.FIELD_TODO)
      : this.form.get(this.toDoListService.FIELD_SUBPOINT);
    this.autoComplete.applyPrediction(currentInput);
    this.predictionTodo = this.predictionSubpoint = '';
  }

  private handleValueChanges(input: string, isTodo: boolean) {
    this.form.get(input)?.valueChanges.subscribe((entry) => {
      if (isTodo) {
        this.predictionSubpoint = '';
        this.predictionTodo = this.autoComplete.predictionTodo;
      } else {
        this.predictionTodo = '';
        this.predictionSubpoint = this.autoComplete.predictionSubpoint;
      }
      try {
        this.autoComplete.handleInputPrediction(entry, isTodo);
      } catch (error) {
        console.error(this.notificationService.MESSAGE_PREDICTION_ERROR, error);
      }
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      // Set existed param or null and set submit button text
      this.queryParam = Number(params['i']) || null;
      this.contentSubmitBtn = this.queryParam ? 'Ändern' : 'Hinzufügen';

      // set param as index and pulls 1 off so that it is the same as the index of element
      if (this.queryParam) {
        try {
          this.toDoListService.getSavedEntrys();
        } catch (error) {
          console.error('Fehler beim Laden der Einträge: ', error);
        }
        this.editEntry = this.toDoListService.toDoList[this.queryParam - 1];
        this.subPoints = this.editEntry?.sublist || [];
      } else {
        this.onClear();
      }
    });

    this.form = this.formBuilder.group({
      todo: [this.editEntry ? this.editEntry.name : null, Validators.required],
      subpoint: [null],
      completionDate: [null, Validators.required],
    });

    this.form.statusChanges.subscribe((entry) => {
      console.log('statusChanged: ', entry);
    });

    this.handleValueChanges(this.toDoListService.FIELD_TODO, true);
    this.handleValueChanges(this.toDoListService.FIELD_SUBPOINT, false);
    this.displayCurrentDate();
  }
}
