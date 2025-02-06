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
    const compDate = this.convertCompletionDate();
    const creationTime = new Date().toLocaleString('de-DE').replace(', ', '-');

    const ifSubPoints: boolean = this.subPoints.length > 0;
    const ifValueExist: boolean = liObService.some(
      (object) => object.name === formTodo
    );

    if (formTodo && !ifValueExist) {
      const newEntry: Object = this.listObjectService.createObject(
        formTodo,
        compDate,
        creationTime,
        ifSubPoints ? this.subPoints : undefined
      );

      liObService.push(newEntry);
      this.listObjectService.saveEntrys();
    } else {
      console.log('Der Eintrag ist schon vorhanden!');
    }
    this.subPoints = [];
    this.form.reset();
    this.displayCurrentDate();
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
      const convertTime = new Date(
        this.editEntry.completitionDate.replace(', um: ', ',')
      )
        .toISOString()
        .slice(0, 16);
      console.log(convertTime);
      return getComplDate?.setValue(convertTime);
    }
  }

  convertCompletionDate() {
    return new Date(this.form.value.completionDate)
      .toLocaleString('de-DE')
      .replace(',', ', um: ')
      .replace(':00', '');
  }

  ngOnInit(): void {
    this.actRoute.queryParams.subscribe((params) => {
      this.queryParam = Number(params['i']);
      if (this.queryParam) {
        this.listObjectService.getSavedEntrys();
        this.editEntry = this.listObjectService.listObject[this.queryParam];
        console.log(this.editEntry);
      }
    });

    this.form = this.formBuilder.group({
      todo: [this.editEntry ? this.editEntry.name : null, Validators.required],
      subpoint: [this.editEntry ? this.editEntry.sublist : null],
      completionDate: [null, Validators.required],
    });

    this.form.statusChanges.subscribe((entry) => {
      console.log(entry);
    });

    this.displayCurrentDate();
  }
}
