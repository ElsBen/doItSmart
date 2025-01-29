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
        <div class="col-4 m-0">
          <h1 class="display-3 ms-3">Do It!</h1>
        </div>
        <div class="col mt-2 me-3 mb-2">
          <ul
            class="nav nav-pills nav-fill gap-2 p-1 small bg-secondary rounded-5 shadow-sm"
            id="pillNav2"
            role="tablist"
            style="--bs-nav-link-color: var(--bs-white); --bs-nav-pills-link-active-color: var(--bs-primary); --bs-nav-pills-link-active-bg: var(--bs-white);"
          >
            <li class="nav-item" role="presentation">
              <button
                class="nav-link active rounded-5"
                id="home-tab2"
                data-bs-toggle="tab"
                type="button"
                role="tab"
                aria-selected="true"
              >
                Home
              </button>
            </li>
            <li class="nav-item" role="presentation">
              <button
                class="nav-link rounded-5"
                id="profile-tab2"
                data-bs-toggle="tab"
                type="button"
                role="tab"
                aria-selected="false"
              >
                Erstellen
              </button>
            </li>
            <li class="nav-item" role="presentation">
              <button
                class="nav-link rounded-5"
                id="contact-tab2"
                data-bs-toggle="tab"
                type="button"
                role="tab"
                aria-selected="false"
              >
                Kalender
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  `,
  styles: ``,
})
export class HeaderComponent {}
