import { Injectable, Input, OnChanges, SimpleChanges } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ListObjectService implements OnChanges {
  constructor() {}

  createObject(
    name: string,
    completitionDate: any,
    creationDate: any,
    sublist?: any
  ) {
    return {
      name: name,
      sublist: sublist,
      completitionDate: completitionDate,
      creationDate: creationDate,
    };
  }

  @Input() listObject = [
    // {
    //   name: 'Einkaufen',
    //   sublist: ['Schokolade', 'Milch', 'Brot'],
    //   note: 'Nicht vergessen!',
    //   completitionDate: '2021-12-24',
    //   creationDate: '2021-12-23',
    // },
    // {
    //   name: 'Saugen',
    //   sublist: ['hinter dem Schrank'],
    //   creationDate: '2021-12-22',
    // },
    // {
    //   name: 'Garage aufräumen',
    //   completitionDate: '2021-12-28',
    //   creationDate: '2021-12-20',
    // },
  ];

  saveEntrys() {
    localStorage.setItem('listObject', JSON.stringify(this.listObject));
  }

  getSavedEntrys() {
    const savedEntrys = localStorage.getItem('listObject');
    if (savedEntrys) {
      this.listObject = JSON.parse(savedEntrys);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
    if (changes['listObject']) {
      console.log('Einträge wurden geändert!', this.listObject);
      localStorage.setItem('listObject', JSON.stringify(this.listObject));
    }
  }
}
