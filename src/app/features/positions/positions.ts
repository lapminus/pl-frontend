import { Component, inject, input, signal } from '@angular/core';
import { SearchComponent } from '../../shared/components/search/search';
import { NoResultsFound } from '../../shared/components/no-results-found/no-results-found';
import { SearchService } from '../../shared/services/search';
import { PlayerSummaryDto } from '../../shared/models/playerSummaryDto.model';

@Component({
  selector: 'app-positions',
  imports: [SearchComponent, NoResultsFound],
  templateUrl: './positions.html',
  styleUrl: './positions.scss',
})
export class Positions {
  searchForPosition = signal('Search position...');
  query = signal('');

  playerService = inject(SearchService);
  players = signal<PlayerSummaryDto[]>([]);

  onSearch(position: string) {
    this.query.set(position);
    this.playerService.search({ position }).subscribe((pageResult) => {
      this.players.set(pageResult.content);
    });
  }
}
