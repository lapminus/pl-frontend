import { Component, inject, OnInit, signal } from '@angular/core';
import { PlayerService } from '../../../shared/services/player.service';
import { ActivatedRoute } from '@angular/router';
import { PlayerSummaryDto } from '../../../shared/models/playerSummaryDto.model';
import { finalize } from 'rxjs';
import { SharedNoResultsFound } from '../../../shared/components/shared-no-results-found/shared-no-results-found';
import { SharedPlayerSummary } from '../../../shared/components/shared-player-summary/shared-player-summary';
import { SharedPagination } from '../../../shared/components/shared-pagination/shared-pagination';

@Component({
  selector: 'app-players-from-position',
  imports: [SharedNoResultsFound, SharedPlayerSummary, SharedPagination],
  templateUrl: './players-from-position.html',
  styleUrl: './players-from-position.scss',
})
export class PlayersFromPosition implements OnInit {
  route = inject(ActivatedRoute);
  playerService = inject(PlayerService);

  isLoading = signal(true);
  hasError = signal(false);

  sendingPlayers = signal<PlayerSummaryDto[]>([]);
  sendingQuery = signal('');

  sendingPages = signal<number>(0);
  sendingCurrentPage = signal<number>(0);

  ngOnInit(): void {
    const position = this.route.snapshot.paramMap.get('position') ?? undefined;
    this.sendingQuery.set(String(position));

    this.playerService
      .searchPlayersBy({ position })
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (result) => {
          (this.sendingPlayers.set(result.content),
            this.sendingPages.set(result.totalPages),
            this.sendingCurrentPage.set(result.number));
        },
        error: () => this.hasError.set(true),
      });
  }

  receivePageChanged(page: number) {
    this.playerService
      .searchPlayersBy({ position: this.sendingQuery(), page })
      .subscribe((pageResult) => {
        (this.sendingPlayers.set(pageResult.content),
          this.sendingCurrentPage.set(pageResult.number));
      });
  }
}
