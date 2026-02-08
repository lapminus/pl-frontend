import { Component, inject, input, signal } from '@angular/core';
import { SearchComponent } from '../../shared/components/search/search';
import { SearchService } from '../../shared/services/search';
import { PlayerDto } from '../../shared/models/playerDto.model';

@Component({
  selector: 'app-nations',
  imports: [SearchComponent],
  templateUrl: './nations.html',
  styleUrl: './nations.scss',
})
export class Nations {
  searchForNation = signal('Search nation...');
  playerService = inject(SearchService);
  players = signal<PlayerDto[]>([]);

  onSearch(nation: string) {
    this.playerService.search({ nation }).subscribe((pageResult) => {
      this.players.set(pageResult.content);
    });
  }
}