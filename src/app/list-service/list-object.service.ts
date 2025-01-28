import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ListObjectService {
  constructor() {}

  listObject: Array<object> = [
    {
      name: 'Einkaufen',
      sublist: { name: 'Schokolade' },
      completitionDate: '2021-12-24',
      creationDate: '2021-12-23',
    },
    {
      name: 'Saugen',
      sublist: { name: 'hinter dem Schrank' },
      completitionDate: '2021-12-23',
      creationDate: '2021-12-22',
    },
  ];
}
