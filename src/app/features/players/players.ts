import { Component, inject, OnInit, signal } from '@angular/core';
import { SharedSearch } from '../../shared/components/shared-search/shared-search';
import { PlayerService } from '../../shared/services/player.service';
import { PlayerSummaryDto } from '../../shared/models/playerSummaryDto.model';
import { SharedNoResultsFound } from '../../shared/components/shared-no-results-found/shared-no-results-found';
import { SharedPlayerSummary } from '../../shared/components/shared-player-summary/shared-player-summary';
import { SharedPagination } from '../../shared/components/shared-pagination/shared-pagination';
import { CreatePlayer } from "./create-player/create-player";

@Component({
  selector: 'app-players',
  imports: [SharedSearch, SharedNoResultsFound, SharedPlayerSummary, SharedPagination, CreatePlayer],
  templateUrl: './players.html',
  styleUrl: './players.scss',
})
export class Players implements OnInit {
  playerService = inject(PlayerService);

  sendingPlaceholder = signal('Search player...');
  sendingQuery = signal('');
  sendingPlayers = signal<PlayerSummaryDto[]>([]);

  sendingPages = signal<number>(0);
  sendingCurrentPage = signal<number>(0);

  ngOnInit(): void {
    this.playerService.searchPlayersBy({ page: 0 }).subscribe((pageResult) => {
      this.sendingPlayers.set(pageResult.content);
      this.sendingPages.set(pageResult.totalPages);
      this.sendingCurrentPage.set(pageResult.number);
    });
  }

  receiveSearch(name: string) {
    this.sendingQuery.set(name);
    this.playerService.searchPlayersBy({ name }).subscribe((pageResult) => {
      // console.log('HTTP response:', JSON.stringify(pageResult, null, 2));
      this.sendingPlayers.set(pageResult.content);
      this.sendingPages.set(pageResult.totalPages);
      this.sendingCurrentPage.set(pageResult.number);
    });
  }

  receivePageChanged(page: number) {
    this.playerService.searchPlayersBy({ page }).subscribe((pageResult) => {
      this.sendingPlayers.set(pageResult.content);
      this.sendingCurrentPage.set(pageResult.number);
    });
  }
}
