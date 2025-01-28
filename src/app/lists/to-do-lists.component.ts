import { Component, Injectable } from '@angular/core';
import { ListObjectService } from '../list-service/list-object.service';

@Component({
  selector: 'app-to-do-lists',
  standalone: true,
  imports: [],
  templateUrl: './to-do-lists.component.html',
  styles: ``,
})
@Injectable({
  providedIn: 'root',
})
export class ToDoListsComponent {
  listObject: Array<object> = [];

  constructor(private listObj: ListObjectService) {}

  getLists() {
    if (this.listObj) {
      this.listObject = this.listObj.listObject;
      console.log(this.listObject);
    }
  }
}
