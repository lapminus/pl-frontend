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
  receivedEditedId = input<number>();
  formErrors = signal<Record<string, string>>({});

  newPlayer: Partial<PlayerDto> = { nation: '' };
  playerCreated = output<PlayerDto>();

  nations = signal<string[]>([]);
  positions = ['MF', 'DF', 'GK', 'FW'];

  showMoreStats = signal(false);

  ngOnInit(): void {
    this.displayNations();
  }

  constructor() {
    effect(() => {
      if (this.receivedEditedId() !== -1) {
        this.playerService.searchPlayerById(Number(this.receivedEditedId())).subscribe((player) => {
          this.newPlayer = { ...player, nation: player.nation ?? '' };
          this.openCreatePlayerModal();
        });
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
    this.newPlayer = { nation: '' };
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

  submitPlayer() {
    if (this.receivedEditedId() !== -1) {
      this.playerService
        .editPlayer(this.newPlayer as PlayerDto, Number(this.receivedEditedId()))
        .subscribe({
          next: (savedPlayer) => {
            ((this.newPlayer = {}),
              this.formErrors.set({}),
              console.log(`Saved player: ${JSON.stringify(savedPlayer, null, 2)}`),
              // saved
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
    } else {
      this.playerService.createPlayer(this.newPlayer as PlayerDto).subscribe({
        next: (createdPlayer) => {
          ((this.newPlayer = {}),
            this.formErrors.set({}),
            this.playerCreated.emit(createdPlayer),
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

  private displayNations() {
    this.playerService.getAllNations().subscribe((result) => {
      const displayName = result.filter((item) => item !== null && item !== '').sort();
      this.nations.set(displayName);
    });
  }
}
