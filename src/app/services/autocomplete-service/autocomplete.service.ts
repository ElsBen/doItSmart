import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AutocompleteService {
  //access token = ***REMOVED***
  apiUrl: string =
    'https://api-inference.huggingface.co/models/tiiuae/falcon-7b-instruct';
  apiToken: string = '***REMOVED***';
  constructor(private http: HttpClient) {}

  getTodoSuggestion(userInput: string): Observable<any> {
    const prompt = ` ${userInput}`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.apiToken}`,
      'Content-Type': 'application/json',
    });
    const body = {
      inputs: prompt,
      parameters: { max_length: 15, temperature: 0.5 },
    };
    return this.http.post(this.apiUrl, body, { headers });
  }
}
