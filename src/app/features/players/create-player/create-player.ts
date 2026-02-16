import { Component, effect, inject, input, OnInit, output, signal } from '@angular/core';
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
export class CreatePlayer implements OnInit {
  playerService = inject(PlayerService);
  isModalOpen = signal(false);
  modalChanged = output<boolean>();
  receivedIsEdited = input(false);
  formErrors = signal<Record<string, string>>({});

  newPlayer: Partial<PlayerDto> = {};
  playerCreated = output<PlayerDto>();

  nations = signal<string[]>([]);
  positions = ['MF', 'DF', 'GK', 'FW'];

  showMoreStats = signal(false);

  ngOnInit(): void {
    this.displayNations();
  }

  constructor() {
    effect(() => {
      if (this.receivedIsEdited()) {
        this.isModalOpen.set(true);
      }
    });
  }

  openCreatePlayerModal() {
    this.isModalOpen.set(true);
    document.body.style.overflow = 'hidden'; // Probably not best practice
  }

  closeCreatePlayerModal() {
    this.isModalOpen.set(false);
    this.modalChanged.emit(true);
    this.newPlayer = {};
    this.formErrors.set({});
    this.showMoreStats.set(false);
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
    if (this.receivedIsEdited()) {
      console.log('CALL SERVICE TO EDIT');
    } else {
      console.log('CALL SERVICE TO CREATE');
    }
    this.closeCreatePlayerModal()
    // this.playerService.createPlayer(this.newPlayer as PlayerDto).subscribe({
    //   next: (createdPlayer) => {
    //     ((this.newPlayer = {}),
    //       this.formErrors.set({}),
    //       this.playerCreated.emit(createdPlayer),
    //       this.closeCreatePlayerModal());
    //   },
    //   error: (err: HttpErrorResponse) => {
    //     if (err.status === 400 && err.error) {
    //       this.formErrors.set(err.error);
    //     } else {
    //       this.formErrors.set({ 'General error': 'Something went wrong.' });
    //     }
    //   },
    // });
  }

  private displayNations() {
    this.playerService.getAllNations().subscribe((result) => {
      const displayName = result.filter((item) => item !== null).sort();
      this.nations.set(displayName);
    });
  }
}
