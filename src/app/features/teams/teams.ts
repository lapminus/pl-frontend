import { Component, signal } from '@angular/core';
import { SearchComponent } from '../../shared/components/search/search';

@Component({
  selector: 'app-teams',
  imports: [SearchComponent],
  templateUrl: './teams.html',
  styleUrl: './teams.scss',
})
export class Teams {
  searchForTeam = signal('Search team...');
}
