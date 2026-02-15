import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PlayerService } from '../../../shared/services/player.service';
import { PlayerDto } from '../../../shared/models/playerDto.model';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-player',
  imports: [FormsModule, CommonModule],
  templateUrl: './create-player.html',
  styleUrl: './create-player.scss',
})
export class CreatePlayer {
  playerService = inject(PlayerService);
  isModalOpen = signal(false);
  formErrors = signal<Record<string, string>>({});

  newPlayer: Partial<PlayerDto> = {};

  nations = ['USA', 'ENG', 'FRA', 'GER', 'BRA']; // example nations
  positions = ['MF', 'DF', 'GK', 'FW']; // available positions

  showMoreStats = signal(false);

  openCreatePlayerModal() {
    this.isModalOpen.set(true);
    document.body.style.overflow = 'hidden'; // Probably not best practice
  }

  closeCreatePlayerModal() {
    this.isModalOpen.set(false);
    this.newPlayer = {};
    this.formErrors.set({});
    document.body.style.overflow = 'visible';
  }

  togglePosition(pos: string) {
    if (!this.newPlayer.pos) {
      this.newPlayer.pos = pos;
    } else {
      const current = this.newPlayer.pos.split(',');
      if (current.includes(pos)) {
        this.newPlayer.pos = current.filter((p) => p !== pos).join(',');
      } else {
        current.push(pos);
        this.newPlayer.pos = current.join(',');
      }
    }
  }

  toggleMoreStats() {
    this.showMoreStats.update((v) => !v);
  }

  isPositionSelected(pos: string): boolean {
    return this.newPlayer.pos?.split(',').includes(pos) ?? false;
  }

  selectNation(nation: string) {
    this.newPlayer.nation = nation;
  }

  submitCreatePlayer() {
    this.playerService.createPlayer(this.newPlayer as PlayerDto).subscribe({
      next: (createdPlayer) => {
        (console.log(`Created player: ${JSON.stringify(createdPlayer, null, 2)}`),
          (this.newPlayer = {}),
          this.formErrors.set({}),
          this.closeCreatePlayerModal());
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 400 && err.error) {
          this.formErrors.set(err.error);
        } else {
          this.formErrors.set({ 'General error': 'Something went wrong.' });
        }
      },
    });
  }
}
