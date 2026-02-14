import { Component, signal } from '@angular/core';
import { PlayerSummaryDto } from '../../../shared/models/playerSummaryDto.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-player',
  imports: [FormsModule],
  templateUrl: './create-player.html',
  styleUrl: './create-player.scss',
})
export class CreatePlayer {
  isModalOpen = signal(false);

  newPlayer: Partial<PlayerSummaryDto> = {};

  openCreatePlayerModal() {
    this.isModalOpen.set(true);
    // document.body.style.overflow = 'hidden';
  }

  closeCreatePlayerModal() {
    this.isModalOpen.set(false);
    this.newPlayer = {};
    // document.body.style.overflow = 'visible';
  }

  submitCreatePlayer() {
    console.log(`Created player: ${JSON.stringify(this.newPlayer, null, 2)}`);

    // call player service
    this.closeCreatePlayerModal();
  }
}
