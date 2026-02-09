import { Component, inject, OnInit, signal } from '@angular/core';
import { SearchComponent } from '../../shared/components/search/search';
import { SearchService } from '../../shared/services/search';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PlayerSummaryDto } from '../../shared/models/playerSummaryDto.model';

@Component({
  selector: 'app-players',
  imports: [SearchComponent, RouterModule, CommonModule],
  templateUrl: './players.html',
  styleUrl: './players.scss',
})
export class Players implements OnInit {
  searchForName = signal('Search player...');
  playerService = inject(SearchService);
  players = signal<PlayerSummaryDto[]>([]);

  ngOnInit(): void {
    this.playerService.search({}).subscribe((pageResult) => {
      this.players.set(pageResult.content);
    });
  }

  onSearch(name: string) {
    this.playerService.search({ name }).subscribe((pageResult) => {
      console.log('HTTP response:', JSON.stringify(pageResult, null, 2));
      this.players.set(pageResult.content);
    });
  }
}
