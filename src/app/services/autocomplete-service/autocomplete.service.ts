import { Injectable } from '@angular/core';
import { HfInference, TextGenerationOutput } from '@huggingface/inference';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AutocompleteService {
  //access token = ***REMOVED***
  // apiUrl: string =
  //   'https://api-inference.huggingface.co/models/ml6team/german-gpt2-medium';
  // apiToken: string = '***REMOVED***';

  private client = new HfInference('***REMOVED***');

  constructor() {}

  async getTodoSuggestion(userInput: string): Promise<string[]> {
    try {
      const response: TextGenerationOutput = await this.client.textGeneration({
        model: 'dbmdz/german-gpt2', // Neues Modell!
        inputs: userInput,

        // provider: 'hf-inference',
        // Möglichkeit eines lokalen Modells prüfen!!!
        parameters: {
          // truncation: true, // Kürzen der Antwort
          max_length: 20, // Kürzere Antwort
          num_return_sequences: 2, // Wieviele Vorschläge generieren
          temperature: 0.2, // Kreativität (niedriger = Wahrscheinlichsten Wörter, höher = weniger Wahrscheinlich aber Kreativer)
          top_k: 50, // Wahrscheinlichste Wörter (höher = mehr Wörter (kreativere Ausgabe) 50 ist guter Kompromiss)
          no_repeat_ngram_size: 2, // Verhindert Wiederholungen
          // top_p: 0.8, // Wahrscheinlichkeitssumme
          // repetition_penalty: 1.2, // Verhindert Wiederholungen sorgt für komisches Verhalten
        },
      });

      // Antwort verarbeiten
      if (!response.generated_text) {
        console.warn('Keine Vorschläge generiert.');
        return [];
      }

      const suggestions = response.generated_text.split('\n').slice(0, 3);
      console.log('Generierte Vorschläge:', suggestions);
      return suggestions;
    } catch (error) {
      console.error('Fehler beim Abrufen der Vorschläge:', error);
      return [];
    }
  }

  // getTodoSuggestion(userInput: string): Observable<any> {
  //   const prompt = `${userInput}`;
  //   const headers = new HttpHeaders({
  //     Authorization: `Bearer ${this.apiToken}`,
  //     'Content-Type': 'application/json',
  //   });
  //   const body = {
  //     inputs: prompt,
  //     parameters: {
  //       max_length: 5,
  //       temperature: 0.2,
  //       top_k: 20,
  //       top_p: 0.9,
  //       repetition_penalty: 1.4,
  //       num_return_sequences: 3,
  //     },
  //   };
  //   return this.http.post(this.apiUrl, body, { headers });
  // }
}
