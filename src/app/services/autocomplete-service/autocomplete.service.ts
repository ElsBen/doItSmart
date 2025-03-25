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
    { input: 'Koch', output: 'Kochen' },
    { input: 'Aufr', output: 'Aufräumen' },
    { input: 'Spü', output: 'Spülen' },
    { input: 'Küc', output: 'Küche Putzen' },
    { input: 'Putze', output: 'Putzen' },
    { input: 'Einkauf', output: 'Einkaufen' },
    { input: 'Wäsche ', output: 'Wäsche Waschen' },
    { input: 'Koche', output: 'Kochen' },
    { input: 'Aufräu', output: 'Aufräumen' },
    { input: 'Spüle', output: 'Spülen' },
    { input: 'Küche P', output: 'Küche Putzen' },
    { input: 'Putzen', output: 'Putzen' },
    { input: 'Einkaufen', output: 'Einkaufen' },
    { input: 'Wäsche Waschen', output: 'Wäsche Waschen' },
    { input: 'Kochen', output: 'Kochen' },
    { input: 'Aufräumen', output: 'Aufräumen' },
    { input: 'Spülen', output: 'Spülen' },
    { input: 'Küche Putzen', output: 'Küche Putzen' },
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
    // this.model.add(tf.layers.dense({ units: 32, activation: 'relu' }));
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

    await this.model.fit(xs, ys, { epochs: 15 });
    console.log('KI trainiert mit neuen Daten!', this.trainingData);
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

  async debugPredictions(input: string) {
    if (!this.encoder) return;

    const inputEmbedding = await this.encoder.embed([input]);
    console.log('Eingabe:', input, 'Shape:', inputEmbedding.shape);

    const inputTensor = inputEmbedding.reshape([512]); // Falls nötig, in 1D umwandeln
    console.log('Eingabe Vektor:', await inputTensor.data());

    for (const data of this.trainingData) {
      const outputEmbedding = await this.encoder.embed([data.output]);
      const outputTensor = outputEmbedding.reshape([512]); // Falls nötig, in 1D umwandeln
      console.log(
        `Vergleich mit "${data.output}"`,
        'Vektor:',
        await outputTensor.data()
      );
    }
  }

  async closestMatch(embedding: Float32Array): Promise<string> {
    let bestMatch = '';
    let bestScore = -Infinity;

    for (const data of this.trainingData) {
      const outputEmbedding = await this.encoder.embed([data.output]);

      const outputTensor = outputEmbedding.reshape([512]).squeeze();
      const inputTensor = tf.tensor(embedding).reshape([512]);

      // console.log('outputTensor:', outputTensor); // Debugging
      // console.log('inputTensor:', inputTensor); // Debugging

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
