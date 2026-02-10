import { Component, inject, OnInit, signal } from '@angular/core';
import { SharedSearch } from '../../shared/components/shared-search/shared-search';
import { PlayerService } from '../../shared/services/player.service';
import { SharedNoResultsFound } from '../../shared/components/shared-no-results-found/shared-no-results-found';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-nations',
  imports: [SharedSearch, SharedNoResultsFound, RouterLink],
  templateUrl: './nations.html',
  styleUrl: './nations.scss',
})
export class Nations implements OnInit {
  sendingPlaceholder = signal('Search nation...');
  playerService = inject(PlayerService);

  sendingQuery = signal('');
  nations = signal<string[]>([]);
  filteredBySearch = signal<string[]>([]);

  ngOnInit(): void {
    this.playerService.getAllNations().subscribe((result) => {
      this.nations.set(result);
      this.filteredBySearch.set(result);
    });
  }

  receiveSearch(nation: string) {
    this.sendingQuery.set(nation);
    this.filteredBySearch.set(
      this.nations().filter((name) => {
        return name?.toLowerCase().includes(nation.toLowerCase());
      }),
    );
  }
}
