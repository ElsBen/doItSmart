import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToDoListService } from '../list-service/list-object.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-entry',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-entry.component.html',
  styles: ``,
})
export class AddEntryComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  subPoints: Array<string> = [];

  queryParam: number | null = null;
  editEntry: any = null;

  constructor(
    private formBuilder: FormBuilder,
    private toDoListService: ToDoListService,
    private activatedRoute: ActivatedRoute
  ) {}

  onSubmit() {
    // Set form entrys
    const nameTodoForm: string = this.form.value.todo;
    const isEditing: boolean = this.queryParam !== null;
    const toDoList: Array<any> = this.toDoListService.toDoList;
    const completionDate = new Date(
      this.form.value.completionDate
    ).toLocaleString('de-DE');
    const creationTime = new Date().toLocaleString('de-DE').replace(', ', '-');

    // check existing entrys or edit entry
    const ifSubPoints: boolean = this.subPoints.length > 0;

    if (this.isDuplicateEntry(nameTodoForm) && !isEditing) {
      console.log('Der Eintrag ist schon vorhanden!');
      return;
    }

    const newEntry: Object = this.toDoListService.createObject(
      nameTodoForm,
      completionDate,
      creationTime,
      ifSubPoints ? this.subPoints : undefined
    );

    if (isEditing && this.queryParam) {
      toDoList[this.queryParam - 1] = newEntry;
    } else {
      toDoList.push(newEntry);
    }

    this.toDoListService.saveEntrys();
    this.onClear();
  }

  private isDuplicateEntry(todo: string): boolean {
    return this.toDoListService.toDoList.some((entry) => entry.name === todo);
  }

  addSubPoint() {
    const subPointValue: any = this.form.value.subpoint;
    const isSubPoint: boolean = this.subPoints.some(
      (todoSubp) => todoSubp === subPointValue
    );

    !isSubPoint && subPointValue
      ? this.subPoints.push(subPointValue)
      : console.log('Kein Wert oder gleicher Wert eingetragen!');
    this.form.get('subpoint')!.reset();
  }

  deleteSubpoint(subpoint: string) {
    const findEntry = this.subPoints.indexOf(subpoint);
    this.subPoints.splice(findEntry, 1);
  }

  displayCurrentDate() {
    const getComplDate = this.form.get('completionDate');

    if (!this.editEntry) {
      const currentDate: string = new Date()
        .toLocaleString('sv-SE')
        .slice(0, 16);

      return getComplDate?.setValue(currentDate);
    } else if (this.editEntry) {
      let toConvertDate = this.editEntry.completionDate;

      const yearTime = toConvertDate.slice(-14, -3);
      const days = toConvertDate.split('.')[0];
      const month = toConvertDate.split('.')[1];
      const convertedDate = new Date(
        `${month}/${days}/${yearTime}`
      ).toLocaleString('sv-SE');

      return getComplDate?.setValue(convertedDate);
    }
  }

  onClear() {
    this.subPoints = [];
    this.form.reset();
    this.displayCurrentDate();
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
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
      console.log(entry);
    });

    this.displayCurrentDate();
  }
}
