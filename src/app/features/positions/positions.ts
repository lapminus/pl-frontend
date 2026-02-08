import { Component, signal } from '@angular/core';
import { SearchComponent } from '../../shared/components/search/search';

@Component({
  selector: 'app-positions',
  imports: [SearchComponent],
  templateUrl: './positions.html',
  styleUrl: './positions.scss',
})
export class Positions {
  searchForPosition = signal('Search position...');
}
