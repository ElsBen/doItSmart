export interface Entry {
  name: string;
  completionDate: string;
  creationDate: string;
  sublist?: SubEntry[];
}

export interface SubEntry {
  name: string;
}
