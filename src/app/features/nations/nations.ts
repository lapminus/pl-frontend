import { Component, inject, input, signal } from '@angular/core';
import { SearchComponent } from '../../shared/components/search/search';
import { SearchService } from '../../shared/services/search';
import { PlayerSummaryDto } from '../../shared/models/playerSummaryDto.model';
import { NoResultsFound } from '../../shared/components/no-results-found/no-results-found';

@Component({
  selector: 'app-nations',
  imports: [SearchComponent, NoResultsFound],
  templateUrl: './nations.html',
  styleUrl: './nations.scss',
})
export class Nations {
  searchForNation = signal('Search nation...');
  playerService = inject(SearchService);

  query = signal('');
  players = signal<PlayerSummaryDto[]>([]);

  onSearch(nation: string) {
    this.query.set(nation);
    this.playerService.search({ nation }).subscribe((pageResult) => {
      this.players.set(pageResult.content);
    });
  }
}
