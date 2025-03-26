import { Injectable } from '@angular/core';
import levenshtein from 'fast-levenshtein';

@Injectable({
  providedIn: 'root',
})
export class AutocompleteService {
  private trainingData: { input: string; output: string }[] = [
    { input: 'Putzen', output: 'Putzen' },
    { input: 'Einkaufen', output: 'Einkaufen' },
    { input: 'Wäsche', output: 'Wäsche' },
    { input: 'Kochen', output: 'Kochen' },
    { input: 'Aufräumen', output: 'Aufräumen' },
    { input: 'Spülen', output: 'Spülen' },
    { input: 'Küche', output: 'Küche' },
    { input: 'Bad', output: 'Bad' },
    { input: 'Staubsaugen', output: 'Staubsaugen' },
    { input: 'Bett', output: 'Bett' },
    { input: 'Fenster', output: 'Fenster' },
    { input: 'Bügeln', output: 'Bügeln' },
    { input: 'Unkraut', output: 'Unkraut' },
  ];

  constructor() {}

  preprocess(text: string): string {
    console.log(text.split(/\s+/g));
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
}
