import { Component, inject, signal } from '@angular/core';
import { SearchComponent } from '../../shared/components/search/search';
import { NoResultsFound } from '../../shared/components/no-results-found/no-results-found';
import { SearchService } from '../../shared/services/search';
import { PlayerSummaryDto } from '../../shared/models/playerSummaryDto.model';

@Component({
  selector: 'app-teams',
  imports: [SearchComponent, NoResultsFound],
  templateUrl: './teams.html',
  styleUrl: './teams.scss',
})
export class Teams {
  searchForTeam = signal('Search team...');
  query = signal('');

  playerService = inject(SearchService);
  players = signal<PlayerSummaryDto[]>([]);

  onSearch(team: string) {
    this.query.set(team);
    this.playerService.search({ team }).subscribe((pageResult) => {
      this.players.set(pageResult.content);
    });
  }
}
