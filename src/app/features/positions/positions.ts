import { Component, inject, input, signal } from '@angular/core';
import { SharedSearch } from '../../shared/components/shared-search/shared-search';
import { SharedNoResultsFound } from '../../shared/components/shared-no-results-found/shared-no-results-found';
import { PlayerService } from '../../shared/services/player.service';
import { PlayerSummaryDto } from '../../shared/models/playerSummaryDto.model';

@Component({
  selector: 'app-positions',
  imports: [SharedSearch, SharedNoResultsFound],
  templateUrl: './positions.html',
  styleUrl: './positions.scss',
})
export class Positions {
  sendingPlaceholder = signal('Search position...');
  sendingQuery = signal('');

  playerService = inject(PlayerService);
  players = signal<PlayerSummaryDto[]>([]);

  receiveSearch(position: string) {
    this.sendingQuery.set(position);
    this.playerService.search({ position }).subscribe((pageResult) => {
      this.players.set(pageResult.content);
    });
  }
}
