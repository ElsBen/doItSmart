import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-add-entry',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './add-entry.component.html',
  styles: ``,
})
export class AddEntryComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  subPoints: Array<string> = [];

  constructor(private formBuilder: FormBuilder) {}

  onSubmit() {
    const formTodo = this.form.value.todo;
    const formSubp = this.form.value.subpoint;

    if (formTodo && formSubp) {
      console.log(this.form.value);
      console.log(this.subPoints);
    } else if (formTodo && !formSubp) {
      console.log(formTodo);
    }
  }

  addSubPoint() {
    const subValue = this.form.value.subpoint;
    const filterValue = this.subPoints.some((arrVal) => arrVal === subValue);
    console.log(filterValue);
    !filterValue
      ? this.subPoints.push(subValue)
      : console.log('Kein Wert eingetragen!');
    console.log(this.subPoints);
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
