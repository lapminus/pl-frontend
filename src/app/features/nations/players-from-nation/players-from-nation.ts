import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PlayerService } from '../../../shared/services/player.service';
import { PlayerSummaryDto } from '../../../shared/models/playerSummaryDto.model';
import { finalize } from 'rxjs';
import { SharedNoResultsFound } from '../../../shared/components/shared-no-results-found/shared-no-results-found';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-players-from-nation',
  imports: [SharedNoResultsFound, RouterLink, CommonModule],
  templateUrl: './players-from-nation.html',
  styleUrl: './players-from-nation.scss',
})
export class PlayersFromNation implements OnInit {
  playerService = inject(PlayerService);
  route = inject(ActivatedRoute);

  isLoading = signal(true);
  hasError = signal(false);

  sendingQuery = signal('');
  players = signal<PlayerSummaryDto[]>([]);

  ngOnInit(): void {
    const nation = this.route.snapshot.paramMap.get('nation') ?? undefined;
    this.sendingQuery.set(String(nation));

    this.playerService
      .searchPlayersBy({ nation })
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (results) => this.players.set(results.content),
        error: () => this.hasError.set(true),
      });
  }
}
