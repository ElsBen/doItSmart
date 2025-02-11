import { Injectable, OnChanges, SimpleChanges } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ToDoListService implements OnChanges {
  constructor() {}

  createObject(
    name: string,
    completionDate: any,
    creationDate: any,
    sublist?: any
  ) {
    return {
      name: name,
      sublist: sublist,
      completionDate: completionDate,
      creationDate: creationDate,
    };
  }

  toDoList: Array<any> = [];

  saveEntrys() {
    localStorage.setItem('toDoList', JSON.stringify(this.toDoList));
  }

  getSavedEntrys() {
    const savedEntrys = localStorage.getItem('toDoList');
    if (savedEntrys) {
      this.toDoList = JSON.parse(savedEntrys);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
    if (changes['toDoList']) {
      console.log('Einträge wurden geändert!', this.toDoList);
      localStorage.setItem('toDoList', JSON.stringify(this.toDoList));
    }
  }
}
