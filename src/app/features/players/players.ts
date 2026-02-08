import { Component, inject, signal } from '@angular/core';
import { SearchComponent } from '../../shared/components/search/search';
import { SearchService } from '../../shared/services/search';
import { PlayerDto } from '../../shared/models/playerDto.model';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-players',
  imports: [SearchComponent, RouterModule, CommonModule],
  templateUrl: './players.html',
  styleUrl: './players.scss',
})
export class Players {
  searchForName = signal('Search player...');
  playerService = inject(SearchService);
  players = signal<PlayerDto[]>([]);

  onSearch(name: string) {
    console.log(`PlayersComponent received: ${name}`);
    this.playerService.search({ name }).subscribe((pageResult) => {
      console.log('HTTP response:', JSON.stringify(pageResult, null, 2));
      this.players.set(pageResult.content);
    });
  }
}
