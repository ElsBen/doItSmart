export interface Entry {
  name: string;
  completionDate: string;
  creationDate: string;
  sectionID: number;
  sublist?: SubEntry[];
  itemID?: number;
}

export interface SubEntry {
  name: string;
  done: boolean;
}
