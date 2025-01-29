import { Component, Injectable, OnInit } from '@angular/core';
import { ListObjectService } from '../list-service/list-object.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-to-do-lists',
  standalone: true,
  imports: [CommonModule],
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
  sublist = false;

  constructor(private listObj: ListObjectService) {}

  getLists() {
    this.listObject = this.listObj.listObject;
    if (this.listObj) {
      this.listObject.forEach((element: object) => {
        console.log(element);
      });
    }
  }

  ngOnInit() {
    this.getLists();
  }
}
