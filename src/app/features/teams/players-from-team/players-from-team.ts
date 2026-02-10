import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PlayerService } from '../../../shared/services/player.service';
import { PlayerSummaryDto } from '../../../shared/models/playerSummaryDto.model';
import { SharedNoResultsFound } from '../../../shared/components/shared-no-results-found/shared-no-results-found';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-players-from-team',
  imports: [SharedNoResultsFound, RouterLink, CommonModule],
  templateUrl: './players-from-team.html',
  styleUrl: './players-from-team.scss',
})
export class PlayersFromTeam implements OnInit {
  playerService = inject(PlayerService);
  route = inject(ActivatedRoute);

  sendingQuery = signal('');
  players = signal<PlayerSummaryDto[]>([]);

  ngOnInit(): void {
    const team = this.route.snapshot.paramMap.get('teamName') ?? undefined;
    this.sendingQuery.set(String(team));
    console.log(team);
    this.playerService.searchPlayersBy({ team }).subscribe((result) => {
      this.players.set(result.content);
    });
  }
}
