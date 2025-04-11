import { Injectable, OnChanges, SimpleChanges } from '@angular/core';
import { Entry, SubEntry } from '../../models/entry.model';

@Injectable({
  providedIn: 'root',
})
export class ToDoListService implements OnChanges {
  constructor() {}

  createObject(
    name: string,
    completionDate: string,
    creationDate: string,
    sublist?: any
  ) {
    return {
      name: name,
      sublist: sublist,
      completionDate: completionDate,
      creationDate: creationDate,
    };
  }

  toDoList: Entry[] = [];

  FIELD_TODO = 'todo';
  FIELD_SUBPOINT = 'subpoint';

  saveEntrys() {
    localStorage.setItem('toDoList', JSON.stringify(this.toDoList));
  }

  getSavedEntrys() {
    const savedEntrys = localStorage.getItem('toDoList');
    if (savedEntrys) {
      this.toDoList = JSON.parse(savedEntrys);
    }
  }

  addSubEntry(list: Entry, newSublistEntry: SubEntry): boolean {
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
