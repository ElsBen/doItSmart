import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-prediction',
  imports: [],
  template: `
    <div class="list-group" style="width: max-content; cursor: pointer">
      <a
        class="list-group-item list-group-item-action list-group-item-success"
        (click)="selectPrediction()"
        >{{ prediction }}</a
      >
    </div>
  `,
  styles: ``,
})
export class PredictionComponent {
  @Input() prediction: string = '';

  @Output() predictionSelected: EventEmitter<string> =
    new EventEmitter<string>();
  selectPrediction() {
    this.predictionSelected.emit();
  }
}
