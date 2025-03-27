import { Injectable } from '@angular/core';
import levenshtein from 'fast-levenshtein';
import { ToDoListService } from '../list-service/todoList.service';

@Injectable({
  providedIn: 'root',
})
export class AutocompleteService {
  constructor(private todoListService: ToDoListService) {
    // Sollte bei Wertänderungen aufgerufen werden
    this.getTodoName();
  }

  private trainingData: { input: string; output: string }[] = [
    // { input: 'Putzen', output: 'Putzen' },
    // { input: 'Einkaufen', output: 'Einkaufen' },
    // { input: 'Wäsche', output: 'Wäsche' },
    // { input: 'Kochen', output: 'Kochen' },
    // { input: 'Aufräumen', output: 'Aufräumen' },
    // { input: 'Spülen', output: 'Spülen' },
    // { input: 'Küche', output: 'Küche' },
    // { input: 'Bad', output: 'Bad' },
    // { input: 'Staubsaugen', output: 'Staubsaugen' },
    // { input: 'Bett', output: 'Bett' },
    // { input: 'Fenster', output: 'Fenster' },
    // { input: 'Bügeln', output: 'Bügeln' },
    // { input: 'Unkraut', output: 'Unkraut' },
  ];

  preprocess(text: string): string {
    // Hier auf das Letzte Wort im Input Prüfen und dann nur das Letzte Wort zurückgeben
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

  getTodoName() {
    this.todoListService.getSavedEntrys();
    console.log(this.todoListService.toDoList);
    this.todoListService.toDoList.forEach((element) => {
      this.trainingData.push({ input: element.name, output: element.name });
    });
  }
}
