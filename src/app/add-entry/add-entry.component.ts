import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ListObjectService } from '../list-service/list-object.service';
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
    private listObjectService: ListObjectService,
    private actRoute: ActivatedRoute
  ) {}

  onSubmit() {
    const formTodo: string = this.form.value.todo;
    const liObService: Array<any> = this.listObjectService.listObject;
    const compDate = new Date(this.form.value.completionDate).toLocaleString(
      'de-DE'
    );
    const creationTime = new Date().toLocaleString('de-DE').replace(', ', '-');

    const ifSubPoints: boolean = this.subPoints.length > 0;

    const checkExistingElements = liObService.filter(
      (element) => element.name === formTodo
    );

    // Prüfung das bei änderung nicht die gleichen Namen in der liste stehen
    if (checkExistingElements.length < 1 || this.queryParam) {
      const newEntry: Object = this.listObjectService.createObject(
        formTodo,
        compDate,
        creationTime,
        ifSubPoints ? this.subPoints : undefined
      );

      if (this.queryParam) {
        liObService[this.queryParam] = newEntry;
      } else {
        liObService.push(newEntry);
      }

      this.listObjectService.saveEntrys();
      this.subPoints = [];
      this.form.reset();
      this.displayCurrentDate();
    } else {
      console.log('Der Eintrag ist schon vorhanden!');
    }
  }

  addSubPoint() {
    const subpValue: any = this.form.value.subpoint;
    const filterValue: boolean = this.subPoints.some(
      (arrVal) => arrVal === subpValue
    );

    !filterValue && subpValue
      ? this.subPoints.push(subpValue)
      : console.log('Kein Wert oder gleicher Wert eingetragen!');
    this.form.get('subpoint')!.reset();
  }

  deleteEntry(subpoint: string) {
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
      let toConvertDate = this.editEntry.completitionDate;

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
    this.actRoute.queryParams.subscribe((params) => {
      this.queryParam = Number(params['i']);
      if (this.queryParam || this.queryParam === 0) {
        this.listObjectService.getSavedEntrys();
        this.editEntry = this.listObjectService.listObject[this.queryParam];
        this.subPoints = this.editEntry.sublist;
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
