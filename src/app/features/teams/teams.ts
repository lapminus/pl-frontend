import { Component, inject, signal } from '@angular/core';
import { SharedSearch } from '../../shared/components/shared-search/shared-search';
import { SharedNoResultsFound } from '../../shared/components/shared-no-results-found/shared-no-results-found';
import { PlayerService } from '../../shared/services/player.service';
import { PlayerSummaryDto } from '../../shared/models/playerSummaryDto.model';

@Component({
  selector: 'app-teams',
  imports: [SharedSearch, SharedNoResultsFound],
  templateUrl: './teams.html',
  styleUrl: './teams.scss',
})
export class Teams {
  sendingPlaceholder = signal('Search team...');
  sendingQuery = signal('');

  playerService = inject(PlayerService);
  players = signal<PlayerSummaryDto[]>([]);

  receiveSearch(team: string) {
    this.sendingQuery.set(team);
    this.playerService.search({ team }).subscribe((pageResult) => {
      this.players.set(pageResult.content);
    });
  }
}
