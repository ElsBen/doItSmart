import { Component, Injectable, OnInit } from '@angular/core';
import { ListObjectService } from '../list-service/list-object.service';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-to-do-lists',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './to-do-lists.component.html',
  styles: `
  .tab-links{
    cursor: pointer;
  }
  `,
})
@Injectable({
  providedIn: 'root',
})
export class ToDoListsComponent implements OnInit {
  listObject: any;
  activeTab: string = 'active';

  form: FormGroup = new FormGroup({});

  constructor(
    private listObj: ListObjectService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  getLists() {
    this.listObject = this.listObj.listObject;
  }

  onSubmit(list: any) {
    const itemIndex = this.listObject.indexOf(list);
    const addItem = this.form.value.subEntry;

    if (list.sublist && addItem) {
      this.listObject[itemIndex].sublist?.push(addItem);
    } else if (addItem) {
      this.listObject[itemIndex].sublist = [addItem];
    }
    this.form.reset();
  }

  onEdit(list: any) {
    console.log(list);
    const indexEntry = this.listObj.listObject.indexOf(list as never);
    this.router.navigate(['create'], { queryParams: { i: indexEntry } });
  }

  onDelete(list: any) {
    const entryObject = this.listObj.listObject;
    const indexEntry = entryObject.indexOf(list as never);

    entryObject.splice(indexEntry, 1);
    this.listObj.saveEntrys();
  }

  ngOnInit() {
    this.listObj.getSavedEntrys();
    this.getLists();
    this.form = this.formBuilder.group({
      subEntry: this.formBuilder.control(null, [Validators.required]),
    });

    this.form.statusChanges.subscribe((entry) => {
      console.log(entry);
    });
  }
}
