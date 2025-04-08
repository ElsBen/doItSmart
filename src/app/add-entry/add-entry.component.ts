import { CommonModule } from '@angular/common';
import { Component, Injectable, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormGroup,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { ToDoListService } from '../services/list-service/todoList.service';
import { DateService } from '../services/date-service/date.service';
import { NotificationComponent } from '../notification/notification.component';
import { NotificationService } from '../services/notification-service/notification.service';
import { AutocompleteService } from '../services/autocomplete-service/autocomplete.service';
import { PredictionComponent } from '../prediction/prediction.component';

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
  subPoints: Array<string> = [];

  queryParam: number | null = null;
  editEntry: {
    name: string;
    completionDate: string;
    sublist?: string[];
  } | null = null;

  predictionTodo: string = '';
  predictionSubpoint: string = '';

  FIELD_TODO = 'todo';
  FIELD_SUBPOINT = 'subpoint';
  COLOR_RED = 'red';
  COLOR_GREEN = 'green';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private dateService: DateService,
    private toDoListService: ToDoListService,
    private notificationService: NotificationService,
    private autoComplete: AutocompleteService
  ) {}

  onSubmit() {
    if (this.isFormInvalid()) return;

    const newEntry = this.createNewEntry();
    this.saveEntry(newEntry);
    this.onClear();
    this.notificationService.showMessage(
      'Ihr Eintrag wurde gesichert!',
      this.COLOR_GREEN
    );
  }

  private isFormInvalid(): boolean {
    if (
      this.form.invalid ||
      this.isDuplicateOrEmptyEntry(this.form.value.todo)
    ) {
      const message = this.form.invalid
        ? 'Eingabefeld ist leer!'
        : 'Eintrag ist schon vorhanden!';
      this.notificationService.showMessage(message, this.COLOR_RED);
      return true;
    }
    return false;
  }

  private createNewEntry(): any {
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
      hasSubPoints ? this.subPoints : undefined
    );
  }

  private saveEntry(newEntry: any): void {
    const toDoList: Array<any> = this.toDoListService.toDoList;
    if (this.queryParam !== null) {
      toDoList[this.queryParam - 1] = newEntry;
    } else {
      toDoList.push(newEntry);
    }
    this.toDoListService.saveEntrys();
    this.autoComplete.trainDataset(newEntry.name, this.autoComplete.isTodo);
  }

  private isDuplicateOrEmptyEntry(todo: string): any {
    return this.toDoListService.toDoList.some((entry) => entry.name === todo);
  }

  addSubPoint() {
    const subPointValue: any = this.form.value.subpoint;
    const isSubPoint: boolean = this.subPoints.some(
      (todoSubp) => todoSubp === subPointValue
    );

    !isSubPoint && subPointValue
      ? this.subPoints.push(subPointValue)
      : this.notificationService.showMessage(
          'Der Eintrag ist schon vorhanden!',
          this.COLOR_RED
        );
    this.autoComplete.trainDataset(subPointValue, this.autoComplete.isTodo);
    this.form.get('subpoint')!.reset();
    this.predictionSubpoint = this.predictionTodo = '';
    this.autoComplete.isTodo = true;
  }

  deleteSubpoint(subpoint: string) {
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
      ? this.form.get(this.FIELD_TODO)
      : this.form.get(this.FIELD_SUBPOINT);
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
        console.error('Fehler bei der Vorhersage: ', error);
      }
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      // Set existed param or null
      this.queryParam = Number(params['i']) || null;

      // set param as index and pulls 1 off so that it is the same as the index of element
      if (this.queryParam) {
        try {
          this.toDoListService.getSavedEntrys();
        } catch (error) {
          console.error('Fehler beim Laden der Einträge: ', error);
        }
        this.editEntry = this.toDoListService.toDoList[this.queryParam - 1];
        this.subPoints = this.editEntry?.sublist || [];
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

    this.handleValueChanges(this.FIELD_TODO, true);
    this.handleValueChanges(this.FIELD_SUBPOINT, false);
    this.displayCurrentDate();
  }
}
