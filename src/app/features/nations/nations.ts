import { Component, inject, input, signal } from '@angular/core';
import { SharedSearch } from '../../shared/components/shared-search/shared-search';
import { PlayerService } from '../../shared/services/player.service';
import { PlayerSummaryDto } from '../../shared/models/playerSummaryDto.model';
import { SharedNoResultsFound } from '../../shared/components/shared-no-results-found/shared-no-results-found';

@Component({
  selector: 'app-nations',
  imports: [SharedSearch, SharedNoResultsFound],
  templateUrl: './nations.html',
  styleUrl: './nations.scss',
})
export class Nations {
  sendingPlaceholder = signal('Search nation...');
  playerService = inject(PlayerService);

  sendingQuery = signal('');
  players = signal<PlayerSummaryDto[]>([]);

  receiveSearch(nation: string) {
    this.sendingQuery.set(nation);
    this.playerService.searchPlayersBy({ nation }).subscribe((pageResult) => {
      console.log('HTTP response: ', JSON.stringify(pageResult, null, 2));
      this.players.set(pageResult.content);
    });
  }
}
