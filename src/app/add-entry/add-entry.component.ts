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

  constructor(
    private formBuilder: FormBuilder,
    private listObjectService: ListObjectService
  ) {}

  onSubmit() {
    const formTodo: string = this.form.value.todo;
    const ifSubPoints = this.subPoints.length > 0;
    const liObService = this.listObjectService.listObject;

    if (formTodo && !ifSubPoints) {
      console.log(formTodo);

      liObService.push({
        name: formTodo,
        sublist: [],
        completitionDate: '2025-03-23',
        creationDate: '2025-03-23',
        note: 'hat geklappt!',
      });
    } else if (ifSubPoints) {
      liObService.push({
        name: formTodo,
        sublist: this.subPoints,
        completitionDate: '2025-03-23',
        creationDate: '2025-03-25',
        note: 'hat geklappt!',
      });
    }
    console.log(this.listObjectService.listObject);
  }

  addSubPoint() {
    const subValue = this.form.value.subpoint;
    const filterValue = this.subPoints.some((arrVal) => arrVal === subValue);

    !filterValue && subValue
      ? this.subPoints.push(subValue)
      : console.log('Kein Wert oder gleicher Wert eingetragen!');
    this.form.get('subpoint')!.reset();
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      todo: [null, Validators.required],
      subpoint: [null],
    });

    this.form.statusChanges.subscribe((entry) => {
      console.log(entry);
    });
  }
}
