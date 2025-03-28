import { Injectable } from '@angular/core';
import levenshtein from 'fast-levenshtein';

@Injectable({
  providedIn: 'root',
})
export class AutocompleteService {
  constructor() {
    const savedDatasets = localStorage.getItem('trainingData');
    this.trainingData = savedDatasets
      ? JSON.parse(savedDatasets)
      : this.trainingData;
  }

  private trainingData: { input: string; output: string }[] = [
    // { input: 'test', output: 'test' },
  ];

  preprocess(text: string): string {
    return text
      .toLowerCase()
      .replace(/\s+/g, '') // Alle Leerzeichen entfernen
      .normalize('NFD') // Umlaute zerlegen (ä → a + ̈)
      .replace(/[\u0300-\u036f]/g, ''); // Diakritische Zeichen entfernen
  }

  // Function to get the closest match from the list of strings
  getClosestMatch(input: string): string {
    let bestMatch = '';
    let bestDistance = Infinity;
    const preprocessedInput = this.preprocess(input);

    for (const data of this.trainingData) {
      let preprocessedData = this.preprocess(data.input);
      let distance = levenshtein.get(preprocessedInput, preprocessedData);

      if (distance > 2) {
        preprocessedData = preprocessedData.substring(0, 4);
        distance = levenshtein.get(
          preprocessedInput.substring(0, 4),
          preprocessedData
        );
      }

      if (distance < bestDistance) {
        bestMatch = data.output;
        bestDistance = distance;
        console.log('Distance: ', bestDistance);
      }
    }
    return bestDistance <= 2 ? bestMatch : 'Keine Übereinstimmung gefunden';
  }

  trainDataset(data: string) {
    this.trainingData.push({ input: data, output: data });
    localStorage.setItem('trainingData', JSON.stringify(this.trainingData));
  }
}
