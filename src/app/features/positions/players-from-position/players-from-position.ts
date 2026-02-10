import { Component, inject, OnInit, signal } from '@angular/core';
import { PlayerService } from '../../../shared/services/player.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PlayerSummaryDto } from '../../../shared/models/playerSummaryDto.model';
import { finalize } from 'rxjs';
import { SharedNoResultsFound } from '../../../shared/components/shared-no-results-found/shared-no-results-found';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-players-from-position',
  imports: [SharedNoResultsFound, RouterLink, CommonModule],
  templateUrl: './players-from-position.html',
  styleUrl: './players-from-position.scss',
})
export class PlayersFromPosition implements OnInit {
  route = inject(ActivatedRoute);
  playerService = inject(PlayerService);

  isLoading = signal(true);
  hasError = signal(false);
  players = signal<PlayerSummaryDto[]>([]);
  sendingQuery = signal('');

  ngOnInit(): void {
    const position = this.route.snapshot.paramMap.get('position') ?? undefined;
    this.sendingQuery.set(String(position));

    this.playerService
      .searchPlayersBy({ position })
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (result) => this.players.set(result.content),
        error: () => this.hasError.set(true),
      });
  }
}
