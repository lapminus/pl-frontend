import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PlayerService } from '../../../shared/services/player.service';
import { PlayerSummaryDto } from '../../../shared/models/playerSummaryDto.model';
import { finalize } from 'rxjs';
import { SharedNoResultsFound } from '../../../shared/components/shared-no-results-found/shared-no-results-found';
import { SharedPlayerSummary } from '../../../shared/components/shared-player-summary/shared-player-summary';
import { SharedPagination } from '../../../shared/components/shared-pagination/shared-pagination';

@Component({
  selector: 'app-players-from-nation',
  imports: [SharedNoResultsFound, SharedPlayerSummary, SharedPagination],
  templateUrl: './players-from-nation.html',
  styleUrl: './players-from-nation.scss',
})
export class PlayersFromNation implements OnInit {
  playerService = inject(PlayerService);
  route = inject(ActivatedRoute);

  isLoading = signal(true);
  hasError = signal(false);

  sendingQuery = signal('');
  sendingPlayers = signal<PlayerSummaryDto[]>([]);

  sendingPages = signal<number>(0);
  sendingCurrentPage = signal<number>(0);

  ngOnInit(): void {
    const nation = this.route.snapshot.paramMap.get('nation') ?? undefined;
    this.sendingQuery.set(String(nation));

    this.playerService
      .searchPlayersBy({ nation })
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (results) => {
          (this.sendingPlayers.set(results.content),
            this.sendingPages.set(results.totalPages),
            this.sendingCurrentPage.set(results.number));
        },
        error: () => this.hasError.set(true),
      });
  }

  receivePageChanged(page: number) {
    this.playerService
      .searchPlayersBy({ nation: this.sendingQuery(), page })
      .subscribe((pageResult) => {
        this.sendingPlayers.set(pageResult.content);
        this.sendingCurrentPage.set(pageResult.number);
      });
  }
}
