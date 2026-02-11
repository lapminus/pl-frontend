import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PlayerService } from '../../../shared/services/player.service';
import { PlayerSummaryDto } from '../../../shared/models/playerSummaryDto.model';
import { SharedNoResultsFound } from '../../../shared/components/shared-no-results-found/shared-no-results-found';
import { finalize } from 'rxjs';
import { SharedPlayerSummary } from '../../../shared/components/shared-player-summary/shared-player-summary';

@Component({
  selector: 'app-players-from-team',
  imports: [SharedNoResultsFound, SharedPlayerSummary],
  templateUrl: './players-from-team.html',
  styleUrl: './players-from-team.scss',
})
export class PlayersFromTeam implements OnInit {
  playerService = inject(PlayerService);
  route = inject(ActivatedRoute);

  isLoading = signal(true);
  hasError = signal(false);
  sendingQuery = signal('');
  players = signal<PlayerSummaryDto[]>([]);

  ngOnInit(): void {
    const team = this.route.snapshot.paramMap.get('teamName') ?? undefined;
    this.sendingQuery.set(String(team));

    this.playerService
      .searchPlayersBy({ team })
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (result) => this.players.set(result.content),
        error: () => this.hasError.set(true),
      });
  }
}
