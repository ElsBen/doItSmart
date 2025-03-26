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

  // Function to get the closest match from the list of strings
  getClosestMatch(input: string): string {
    let bestMatch = '';
    let bestDistance = Infinity;

    for (const data of this.trainingData) {
      const distance = levenshtein.get(
        input.toLowerCase(),
        data.input.toLowerCase()
      );
      if (distance < bestDistance) {
        bestMatch = data.output;
        bestDistance = distance;
      }
    }
    return bestMatch || 'Keine Übereinstimmung gefunden';
  }
}
