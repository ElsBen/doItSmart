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

  addSubEntry(list: any, newSublistEntry: string): boolean {
    const entryIndex = this.toDoList.indexOf(list);
    const existSublist = this.toDoList[entryIndex].sublist;

    if (!newSublistEntry) return false;

    if (existSublist) {
      if (existSublist.includes(newSublistEntry)) {
        return false; // Sub-Entry existiert bereits
      }
      this.toDoList[entryIndex].sublist?.push(newSublistEntry);
    } else {
      this.toDoList[entryIndex].sublist = [newSublistEntry];
    }

    this.saveEntrys();
    return true;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['toDoList']) {
      localStorage.setItem('toDoList', JSON.stringify(this.toDoList));
    }
  }
}
