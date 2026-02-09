import { Component, inject, OnInit, signal } from '@angular/core';
import { SearchComponent } from '../../shared/components/search/search';
import { SearchService } from '../../shared/services/search';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PlayerSummaryDto } from '../../shared/models/playerSummaryDto.model';
import { NoResultsFound } from '../../shared/components/no-results-found/no-results-found';

@Component({
  selector: 'app-players',
  imports: [SearchComponent, RouterModule, CommonModule, NoResultsFound],
  templateUrl: './players.html',
  styleUrl: './players.scss',
})
export class Players implements OnInit {
  searchForName = signal('Search player...');
  query = signal('');

  playerService = inject(SearchService);
  players = signal<PlayerSummaryDto[]>([]);

  ngOnInit(): void {
    this.playerService.search({}).subscribe((pageResult) => {
      this.players.set(pageResult.content);
    });
  }

  onSearch(name: string) {
    this.query.set(name);
    this.playerService.search({ name }).subscribe((pageResult) => {
      console.log('HTTP response:', JSON.stringify(pageResult, null, 2));
      this.players.set(pageResult.content);
    });
  }
}
