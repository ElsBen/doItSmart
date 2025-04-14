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
    sublist?: SubEntry[]
  ): Entry {
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

  addSubEntry(list: Entry, newSublistEntry: string): boolean {
    const newEntry: SubEntry = { name: newSublistEntry, done: false };
    const entryIndex = this.toDoList.indexOf(list);
    const existSublist = this.toDoList[entryIndex].sublist;

    if (!newSublistEntry) return false;

    if (existSublist) {
      if (existSublist.find((subEntry) => subEntry.name === newSublistEntry)) {
        return false; // Sub-Entry existiert bereits
      }
      this.toDoList[entryIndex].sublist?.push(newEntry);
    } else {
      this.toDoList[entryIndex].sublist = [newEntry];
    }

    this.saveEntrys();
    return true;
  }

  changeSubEntryStatus(entry: SubEntry, list: Entry) {
    const entryIndex = this.toDoList.indexOf(list);
    const sublist = this.toDoList[entryIndex].sublist;
    if (sublist) {
      const subEntryIndex = sublist.indexOf(entry);
      sublist[subEntryIndex].done
        ? (sublist[subEntryIndex].done = true)
        : (sublist[subEntryIndex].done = false);
      this.saveEntrys();
    } else {
      console.error('Keine Unterpunkte gefunden.');
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['toDoList']) {
      localStorage.setItem('toDoList', JSON.stringify(this.toDoList));
    }
  }
}
