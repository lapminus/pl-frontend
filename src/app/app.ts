import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './layout/header/header';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent],
  template: `
    <app-header />
    <main><router-outlet /></main>
  `,
  styles: `
    main {
      padding: 16px;
      background-color: #202c3f; /* soft light gray background */
      min-height: calc(100vh - 64px);
    }
  `,
})
export class App {
  protected readonly title = signal('pl-frontend');
}
