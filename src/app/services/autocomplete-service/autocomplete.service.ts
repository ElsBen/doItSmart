import { Injectable } from '@angular/core';
import levenshtein from 'fast-levenshtein';

@Injectable({
  providedIn: 'root',
})
export class AutocompleteService {
  isTodo: boolean = true;
  predictionTodo: string = '';
  predictionSubpoint: string = '';

  constructor() {
    const savedDatasets = localStorage.getItem('trainingData');
    this.trainingData = savedDatasets
      ? JSON.parse(savedDatasets)
      : this.trainingData;
  }

  private trainingData: {
    todos: {
      input: string;
      output: string;
    }[];
    subpoints: {
      input: string;
      output: string;
    }[];
  } = { todos: [], subpoints: [] };

  preprocess(text: string): string {
    return text
      .toLowerCase()
      .replace(/\s+/g, '') // Alle Leerzeichen entfernen
      .normalize('NFD') // Umlaute zerlegen (ä → a + ̈)
      .replace(/[\u0300-\u036f]/g, ''); // Diakritische Zeichen entfernen
  }

  // Function to get the closest match from the list of strings
  getClosestMatch(input: string, isTodo: boolean): string {
    let bestMatch = '';
    let bestDistance = Infinity;
    const preprocessedInput = this.preprocess(input);
    const dataset = isTodo
      ? this.trainingData.todos
      : this.trainingData.subpoints;

    for (const data of dataset) {
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

  trainDataset(data: string, isTodo: boolean) {
    const dataset = isTodo
      ? this.trainingData.todos
      : this.trainingData.subpoints;
    if (dataset.some((entry) => entry.input === data)) {
      return;
    }

    dataset.push({ input: data, output: data });
    localStorage.setItem('trainingData', JSON.stringify(this.trainingData));
  }

  handleInputPrediction(value: string, isTodo: boolean) {
    this.isTodo = isTodo;

    if (value === null) {
      isTodo ? (this.predictionTodo = '') : (this.predictionSubpoint = '');
      return;
    }

    if (value.length > 2) {
      isTodo
        ? (this.predictionTodo = this.getClosestMatch(value, isTodo))
        : (this.predictionSubpoint = this.getClosestMatch(value, isTodo)); // hier noch den Boolean durchgeben
    } else {
      isTodo ? (this.predictionTodo = '') : (this.predictionSubpoint = '');
    }
  }

  applyPrediction(currentInput: any) {
    if (currentInput === null) {
      return;
    }

    currentInput?.setValue(
      this.isTodo ? this.predictionTodo : this.predictionSubpoint
    );

    this.predictionSubpoint = this.predictionTodo = '';
    this.isTodo = true;
  }
}
