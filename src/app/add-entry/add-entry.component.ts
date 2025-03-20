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

@Injectable({
  providedIn: 'root',
})
@Component({
  selector: 'app-add-entry',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NotificationComponent],
  templateUrl: './add-entry.component.html',
  styles: ``,
})
export class AddEntryComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  subPoints: Array<string> = [];

  queryParam: number | null = null;
  editEntry: any = null;
  suggestion: string = '';

  prediction: string = '';

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
    // Set form entrys
    const nameTodoForm: string = this.form.value.todo;
    const isEditing: boolean = this.queryParam !== null;
    const toDoList: Array<any> = this.toDoListService.toDoList;
    const completionDate = this.dateService.convertDateToLocalDate(
      this.form.value.completionDate
    );

    const creationTime = this.dateService.convertDateToLocalDate();
    // check existing entrys or edit entry
    const hasSubPoints: boolean = this.subPoints.length > 0;

    if (
      (this.isDuplicateOrEmptyEntry(nameTodoForm) && !isEditing) ||
      this.form.invalid
    ) {
      this.form.invalid
        ? this.notificationService.showMessage('Eingabefeld ist leer!', 'red')
        : this.notificationService.showMessage(
            'Eintrag ist schon vorhanden!',
            'red'
          );
      return;
    }

    const newEntry: Object = this.toDoListService.createObject(
      nameTodoForm,
      completionDate,
      creationTime,
      hasSubPoints ? this.subPoints : undefined
    );

    if (isEditing && this.queryParam) {
      toDoList[this.queryParam - 1] = newEntry;
    } else {
      toDoList.push(newEntry);
    }

    this.toDoListService.saveEntrys();
    this.onClear();
    this.notificationService.showMessage(
      'Ihr Eintrag wurde gesichert!',
      'green'
    );
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
          'red'
        );
    this.form.get('subpoint')!.reset();
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

  async handleTodoInputChange(value: string) {
    if (value.length > 2) {
      console.log('Vorhersage: ', this.prediction);
      this.prediction = await this.autoComplete.predict(value);
      this.autoComplete.debugPredictions(value);
    } else {
      this.prediction = '';
    }
  }

  trainData() {
    const value = this.form.value.todo;

    this.autoComplete.train({
      input: `${value.slice(0, 4)}`,
      output: `${value}`,
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      // Set existed param or null
      this.queryParam = Number(params['i']) || null;

      // set param as index and pulls 1 off so that it is the same as the index of element
      if (this.queryParam) {
        this.toDoListService.getSavedEntrys();
        this.editEntry = this.toDoListService.toDoList[this.queryParam - 1];
        this.subPoints = this.editEntry.sublist || [];
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

    this.form.get('todo')?.valueChanges.subscribe((value) => {
      console.log('Wertänderung: ', value);
      this.handleTodoInputChange(value);
    });

    this.displayCurrentDate();
  }
}
