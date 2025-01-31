import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-entry',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './add-entry.component.html',
  styles: ``,
})
export class AddEntryComponent implements OnInit {
  form: FormGroup = new FormGroup({});

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({});
  }
}
