import * as tf from '@tensorflow/tfjs';

export class AutocompleteService {
  private model: tf.Sequential = tf.sequential();
  private trainingData: { input: string; output: string }[] = [];

  constructor() {
    this.initModel();
  }

  async initModel() {
    // this.model = tf.sequential();
    this.model.add(
      tf.layers.dense({ units: 10, inputShape: [1], activation: 'relu' })
    );
    this.model.add(tf.layers.dense({ units: 1 }));
    this.model.compile({ loss: 'meanSquaredError', optimizer: 'sgd' });
    console.log('KI Model bereit!');
  }
  async train(newData: { input: string; output: string }) {
    this.trainingData.push(newData);

    const xs = tf.tensor2d(this.trainingData.map((d) => [d.input.length]));
    const ys = tf.tensor2d(this.trainingData.map((d) => [d.output.length]));

    await this.model.fit(xs, ys, { epochs: 10 });
    console.log('KI trainiert mit neuen Daten!');
  }

  async predict(input: string) {
    const prediction = this.model.predict(
      tf.tensor2d([[input.length]])
    ) as tf.Tensor;
    const output = await prediction.data();
    console.log(`Vorhersage für '${input}': ${output[0]}`);
    return output[0];
  }
}
