import { Injectable } from '@angular/core';
import * as tf from '@tensorflow/tfjs';
import * as use from '@tensorflow-models/universal-sentence-encoder';

@Injectable({
  providedIn: 'root',
})
export class AutocompleteService {
  private model: tf.Sequential = tf.sequential();
  private trainingData: { input: string; output: string }[] = [
    { input: 'Put', output: 'Putzen' },
    { input: 'Eink', output: 'Einkaufen' },
    { input: 'Wäsc', output: 'Wäsche Waschen' },
  ];
  private encoder: any;

  constructor() {
    this.loadEncoder();
  }

  async loadEncoder() {
    this.encoder = await use.load();
    this.initModel();
  }

  async initModel() {
    this.model.add(
      tf.layers.dense({ units: 64, inputShape: [512], activation: 'relu' })
    );
    this.model.add(tf.layers.dense({ units: 32, activation: 'relu' }));
    this.model.add(tf.layers.dense({ units: 512 }));
    this.model.compile({ loss: 'meanSquaredError', optimizer: 'adam' });
    console.log('KI Model bereit!');
  }

  async train(newData: { input: string; output: string }) {
    if (!this.encoder) {
      console.warn('Encoder nicht geladen');
      return;
    }

    this.trainingData.push(newData);

    const xs = await this.encoder.embed(this.trainingData.map((d) => d.input));
    const ys = await this.encoder.embed(this.trainingData.map((d) => d.output));

    await this.model.fit(xs, ys, { epochs: 20 });
    console.log('KI trainiert mit neuen Daten!');
  }

  async predict(input: string): Promise<string> {
    if (!this.encoder) {
      return 'Encoder nicht geladen!';
    }

    const inputEmbedding = await this.encoder.embed([input]);
    const prediction = this.model.predict(inputEmbedding);
    if (!Array.isArray(prediction)) {
      const outputEmbedding = new Float32Array(await prediction.data());
      return this.closestMatch(outputEmbedding);
    } else {
      return 'Fehler in der Vorhersage!';
    }
  }

  async closestMatch(embedding: Float32Array): Promise<string> {
    // trainingData wurde mit Testdaten gefüllt, hierbei entsteht ein Typenfehler von tensor
    let bestMatch = '';
    let bestScore = -Infinity;
    for (const data of this.trainingData) {
      const outputEmbedding = await this.encoder.embed([data.output]);
      const outputTensor = outputEmbedding.reshape([512]);
      const inputTensor = tf.tensor(embedding).reshape([512]);
      const score = tf.losses
        .cosineDistance(outputTensor, inputTensor, 0)
        .dataSync()[0];

      if (score > bestScore) {
        bestMatch = data.output;
        bestScore = score;
      }
    }
    console.log('Der Vorschlag: ', bestMatch);
    console.log('Bester Score: ', bestScore);
    return bestMatch;
  }
}
