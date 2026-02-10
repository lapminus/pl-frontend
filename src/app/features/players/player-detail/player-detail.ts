import { Component, inject, OnInit, signal } from '@angular/core';
import { PlayerService } from '../../../shared/services/player.service';
import { ActivatedRoute } from '@angular/router';
import { PlayerDto } from '../../../shared/models/playerDto.model';
import { KeyValuePipe } from '@angular/common';
import { SharedNoResultsFound } from '../../../shared/components/shared-no-results-found/shared-no-results-found';

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
  player = signal<PlayerDto | null | undefined>(undefined);

  excludeFields = ['playerName', 'id'];

  ngOnInit(): void {
    const playerId = Number(this.route.snapshot.paramMap.get('id'));
    this.sendingQuery.set(playerId);

    if (playerId) {
      this.playerService.searchPlayerById(playerId).subscribe({
        next: (p) => {
          this.player.set(p);
        },
        error: (err) => {
          this.player.set(null);
        },
      });
    } else {
      this.player.set(null);
    }
  }
}
