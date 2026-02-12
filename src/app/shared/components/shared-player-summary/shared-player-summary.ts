import { Component, input } from '@angular/core';
import { PlayerSummaryDto } from '../../models/playerSummaryDto.model';
import { RouterLink } from "@angular/router";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shared-player-summary',
  imports: [RouterLink, CommonModule],
  templateUrl: './shared-player-summary.html',
  styleUrl: './shared-player-summary.scss',
})
export class SharedPlayerSummary {
  receivedPlayers = input.required<PlayerSummaryDto[]>();

}
