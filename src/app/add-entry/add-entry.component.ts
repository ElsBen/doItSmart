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
    const liObService: Array<any> = this.listObjectService.listObject;
    const ifSubPoints: boolean = this.subPoints.length > 0;
    const ifValueExist: boolean = liObService.some(
      (object) => object.name === formTodo
    );

    if (formTodo && !ifSubPoints && !ifValueExist) {
      const newEntry: Object = this.listObjectService.createObject(
        formTodo,
        '2025-03-23',
        '2025-03-23'
      );
      liObService.push(newEntry);
    } else if (ifSubPoints && !ifValueExist) {
      const newEntry: Object = this.listObjectService.createObject(
        formTodo,
        '2025-03-23',
        '2025-03-25',
        this.subPoints
      );
      liObService.push(newEntry);
    } else {
      console.log('Der Eintrag ist schon vorhanden!');
    }
    this.form.reset();
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
