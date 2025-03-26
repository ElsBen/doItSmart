import { Injectable } from '@angular/core';
import levenshtein from 'fast-levenshtein';

@Injectable({
  providedIn: 'root',
})
export class AutocompleteService {
  private trainingData: { input: string; output: string }[] = [
    { input: 'Put', output: 'Putzen' },
    { input: 'Eink', output: 'Einkaufen' },
    { input: 'Wäsche W', output: 'Wäsche Waschen' },
    { input: 'Koch', output: 'Kochen' },
    { input: 'Aufr', output: 'Aufräumen' },
    { input: 'Spü', output: 'Spülen' },
    { input: 'Küche P', output: 'Küche Putzen' },
    { input: 'Bad P', output: 'Bad Putzen' },
    { input: 'Staubs', output: 'Staubsaugen' },
    { input: 'Bett b', output: 'Bett beziehen' },
    { input: 'Fenster P', output: 'Fenster Putzen' },
    { input: 'Büg', output: 'Bügeln' },
    { input: 'Bad W', output: 'Bad Wischen' },
  ];

  constructor() {}

  preprocess(text: string): string {
    return text
      .toLowerCase() // Kleinbuchstaben
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
      const preprocessedData = this.preprocess(data.input);
      const distance = levenshtein.get(preprocessedInput, preprocessedData);
      if (distance < bestDistance) {
        bestMatch = data.output;
        bestDistance = distance;
      }
    }
    return bestMatch || 'Keine Übereinstimmung gefunden';
  }
}
