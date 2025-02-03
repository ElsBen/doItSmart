import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ListObjectService {
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

  listObject = [
    {
      name: 'Einkaufen',
      sublist: ['Schokolade', 'Milch', 'Brot'],
      note: 'Nicht vergessen!',
      completitionDate: '2021-12-24',
      creationDate: '2021-12-23',
    },
    {
      name: 'Saugen',
      sublist: ['hinter dem Schrank'],
      creationDate: '2021-12-22',
    },
    {
      name: 'Garage aufräumen',
      completitionDate: '2021-12-28',
      creationDate: '2021-12-20',
    },
  ];
}
