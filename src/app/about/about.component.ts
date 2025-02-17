import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [],
  template: `
    <div
      class="d-flex align-items-center justify-content-center"
      style="min-height: 100vh"
    >
      <div class="mt-5 p-5" style=" min-width: 60%">
        <h1>About the Do It Smart App</h1>
        <p>
          Do It Smart is my app that helps you efficiently manage your tasks and
          deadlines. <br />
          The app is open-source and uses the MIT License, which means you can
          use, modify, and distribute the code for free. <br />
          You can find more details in the LICENSE file.
        </p>
        <h2>Upcoming Features</h2>
        <p>
          I’m working on expanding the app by integrating Artificial
          Intelligence. Planned features include:
        </p>

        <li class="mt-2">
          Label color changes for the deadline date based on the remaining time.
        </li>
        <li class="mt-2">
          Autocomplete and suggested examples for user inputs to optimize the
          user experience and make task entry easier.
        </li>
        <li class="mt-2">
          Notifications and reminders to alert you about upcoming deadlines.
        </li>
        <li class="mt-2">
          Task prioritization, where you can sort tasks by urgency.
        </li>
        <li class="mt-2">
          Calendar integration to transfer deadlines directly to your personal
          calendar.
        </li>
        <li class="mt-2">
          Task categorization with tags or colors to quickly group similar tasks
          together.
        </li>

        <p class="mt-4">Stay tuned to experience these exciting updates!</p>
      </div>
    </div>
  `,
  styles: ``,
})
export class AboutComponent {}
