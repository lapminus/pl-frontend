import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { PlayerService } from '../../../shared/services/player.service';
import { ActivatedRoute } from '@angular/router';
import { PlayerDto } from '../../../shared/models/playerDto.model';
import { KeyValuePipe } from '@angular/common';
import { NoResultsFound } from '../../../shared/components/no-results-found/no-results-found';

@Component({
  selector: 'app-player-detail',
  imports: [KeyValuePipe, NoResultsFound],
  templateUrl: './player-detail.html',
  styleUrl: './player-detail.scss',
})
export class PlayerDetail implements OnInit {
  playerService = inject(PlayerService);
  route = inject(ActivatedRoute);

  query = signal<string | number>('');
  player = signal<PlayerDto | null | undefined>(undefined);

  excludeFields = ['playerName', 'id'];

  ngOnInit(): void {
    const playerId = Number(this.route.snapshot.paramMap.get('id'));
    this.query.set(playerId);

    if (playerId) {
      this.playerService.searchById(playerId).subscribe({
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
