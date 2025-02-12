import { Component, Injectable, input, OnInit } from '@angular/core';
import { ToDoListService } from '../list-service/todoList.service';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { DateService } from '../date-service/date.service';

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
  toDoList: any;
  activeTab: string = 'active';

  form: FormGroup = new FormGroup({});
  // Public umstellen auf getter
  constructor(
    private toDoListService: ToDoListService,
    private formBuilder: FormBuilder,
    private router: Router,
    public dateService: DateService
  ) {}

  getLists() {
    this.toDoList = this.toDoListService.toDoList;
  }

  onSubmit(list: any) {
    const itemIndex = this.toDoList.indexOf(list);
    const addItem = this.form.value.subEntry;

    if (list.sublist && addItem) {
      this.toDoList[itemIndex].sublist?.push(addItem);
    } else if (addItem) {
      this.toDoList[itemIndex].sublist = [addItem];
    }
    this.toDoListService.saveEntrys();
    this.form.reset();
  }

  onEdit(list: any) {
    //multiplying with 1 avoids problems with null or undefined in add-entry
    const indexEntry = this.toDoListService.toDoList.indexOf(list);
    this.router.navigate(['create'], { queryParams: { i: indexEntry + 1 } });
  }

  onDelete(list: any) {
    const entryObject = this.toDoListService.toDoList;
    const indexEntry = entryObject.indexOf(list);

    entryObject.splice(indexEntry, 1);
    this.toDoListService.saveEntrys();
  }

  // get convertCompletionDateShortView(): string {
  //   return this.dateService.convertCompletionDateShortView(completionDate);
  // }

  ngOnInit() {
    this.toDoListService.getSavedEntrys();
    this.getLists();
    this.form = this.formBuilder.group({
      subEntry: this.formBuilder.control(null, [Validators.required]),
    });

    this.form.statusChanges.subscribe((entry) => {
      console.log(entry);
    });
  }
}
