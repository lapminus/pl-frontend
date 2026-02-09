import { Component, input } from '@angular/core';

@Component({
  selector: 'app-no-results-found',
  imports: [],
  templateUrl: './no-results-found.html',
  styleUrl: './no-results-found.scss',
})
export class NoResultsFound {
  query = input.required<string | number>();
}
