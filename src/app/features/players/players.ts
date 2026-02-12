import { Component, inject, OnInit, signal } from '@angular/core';
import { SharedSearch } from '../../shared/components/shared-search/shared-search';
import { PlayerService } from '../../shared/services/player.service';
import { PlayerSummaryDto } from '../../shared/models/playerSummaryDto.model';
import { SharedNoResultsFound } from '../../shared/components/shared-no-results-found/shared-no-results-found';
import { SharedPlayerSummary } from '../../shared/components/shared-player-summary/shared-player-summary';
import { Pagination } from './pagination/pagination';

@Component({
  selector: 'app-players',
  imports: [SharedSearch, SharedNoResultsFound, SharedPlayerSummary, Pagination],
  templateUrl: './players.html',
  styleUrl: './players.scss',
})
export class Players implements OnInit {
  sendingPlaceholder = signal('Search player...');
  sendingQuery = signal('');

  playerService = inject(PlayerService);
  sendingPlayers = signal<PlayerSummaryDto[]>([]);
  sendingPages = signal<number>(0);
  sendingCurrentPage = signal<number>(0);

  ngOnInit(): void {
    this.playerService.searchPlayersBy({}).subscribe((pageResult) => {
      this.sendingPlayers.set(pageResult.content);
      this.sendingPages.set(pageResult.totalPages);
      console.log(`#of pages sent: ${this.sendingPages()}`)

      this.sendingCurrentPage.set(pageResult.number);
    });
  }

  receiveSearch(name: string) {
    this.sendingQuery.set(name);
    this.playerService.searchPlayersBy({ name }).subscribe((pageResult) => {
      console.log('HTTP response:', JSON.stringify(pageResult, null, 2));
      this.sendingPlayers.set(pageResult.content);
    });
  }

  receivePageChanged(page: number) {
    this.sendingCurrentPage.set(page);
  }
}
