import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  template: `
    <div class="header-cont container-fluid m-0 p-0 bg-black text-light">
      <div
        class="row display-inline align-items-center justify-content-between"
      >
        <div class="col-4 m-0 p-0">
          <h1 class="display-3 ms-4">Do It!</h1>
        </div>
      </div>
    </div>
  `,
  styles: ``,
})
export class HeaderComponent {}
