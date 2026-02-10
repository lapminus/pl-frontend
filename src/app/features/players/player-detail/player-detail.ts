import { Component, inject, OnInit, signal } from '@angular/core';
import { PlayerService } from '../../../shared/services/player.service';
import { ActivatedRoute } from '@angular/router';
import { PlayerDto } from '../../../shared/models/playerDto.model';
import { KeyValuePipe } from '@angular/common';
import { SharedNoResultsFound } from '../../../shared/components/shared-no-results-found/shared-no-results-found';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-player-detail',
  imports: [KeyValuePipe, SharedNoResultsFound],
  templateUrl: './player-detail.html',
  styleUrl: './player-detail.scss',
})
export class PlayerDetail implements OnInit {
  playerService = inject(PlayerService);
  route = inject(ActivatedRoute);

  sendingQuery = signal<string | number>('');
  isLoading = signal<boolean>(true);
  hasError = signal<boolean>(false);
  player = signal<PlayerDto | null>(null);

  excludeFields = ['playerName', 'id'];

  ngOnInit(): void {
    const playerId = Number(this.route.snapshot.paramMap.get('id'));
    this.sendingQuery.set(playerId);

    this.playerService
      .searchPlayerById(playerId)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (res) => this.player.set(res),
        error: () => this.hasError.set(true),
      });
  }
}
