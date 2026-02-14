import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PlayerService } from '../../../shared/services/player.service';
import { PlayerDto } from '../../../shared/models/playerDto.model';

@Component({
  selector: 'app-create-player',
  imports: [FormsModule],
  templateUrl: './create-player.html',
  styleUrl: './create-player.scss',
})
export class CreatePlayer {
  playerService = inject(PlayerService);
  isModalOpen = signal(false);

  newPlayer: Partial<PlayerDto> = {};

  openCreatePlayerModal() {
    this.isModalOpen.set(true);
    document.body.style.overflow = 'hidden'; // Probably not best practice
  }

  closeCreatePlayerModal() {
    this.isModalOpen.set(false);
    this.newPlayer = {};
    document.body.style.overflow = 'visible';
  }

  submitCreatePlayer() {
    this.playerService.createPlayer(this.newPlayer as PlayerDto).subscribe({
      next: (createdPlayer) => {
        (console.log(`Created player: ${JSON.stringify(createdPlayer, null, 2)}`),
          (this.newPlayer = {}),
          this.closeCreatePlayerModal());
      },
      error: (error) => console.log(`Failed to create player: ${JSON.stringify(error, null, 2)}`),
    });
  }
}
