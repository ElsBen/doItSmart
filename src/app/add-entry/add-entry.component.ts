import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ListObjectService } from '../list-service/list-object.service';

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
  currentDate: string = new Date().toLocaleString('sv-SE').slice(0, 16);

  constructor(
    private formBuilder: FormBuilder,
    private listObjectService: ListObjectService
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
    return this.form.get('completionDate')?.setValue(this.currentDate);
  }

  convertCompletionDate() {
    return new Date(this.form.value.completionDate)
      .toLocaleString('de-DE')
      .replace(',', ', um: ')
      .replace(':00', '');
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      todo: [null, Validators.required],
      subpoint: [null],
      completionDate: [null, Validators.required],
    });

    this.form.statusChanges.subscribe((entry) => {
      console.log(entry);
    });

    this.displayCurrentDate();
  }
}
