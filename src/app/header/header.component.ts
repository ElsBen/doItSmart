import { Component, Injectable } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div
      class="header-content container-fluid m-0 p-0 bg-black text-light"
      style="max-width: 100vw;"
    >
      <div class=" d-flex align-items-center justify-content-between">
        <div class="col-6 m-0 p-0">
          <h1 class="display-3 ms-4">Do It!</h1>
        </div>
        <div class="col-5">
          <div class="dropdown d-flex justify-content-end me-3">
            <button
              class="btn btn-secondary dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Menü
            </button>
            <ul class="dropdown-menu">
              <li>
                <a class="dropdown-item" routerLink="create">Erstellen</a>
              </li>
              <li><a class="dropdown-item" routerLink="lists">Liste</a></li>
              <!-- <li><a class="dropdown-item" href="#">Something else here</a></li> -->
            </ul>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: ``,
})
@Injectable({
  providedIn: 'root',
})
export class HeaderComponent {}
