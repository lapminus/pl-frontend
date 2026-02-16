import { Component, inject, OnInit, signal } from '@angular/core';
import { SharedSearch } from '../../shared/components/shared-search/shared-search';
import { PlayerService } from '../../shared/services/player.service';
import { PlayerSummaryDto } from '../../shared/models/playerSummaryDto.model';
import { SharedNoResultsFound } from '../../shared/components/shared-no-results-found/shared-no-results-found';
import { SharedPlayerSummary } from '../../shared/components/shared-player-summary/shared-player-summary';
import { SharedPagination } from '../../shared/components/shared-pagination/shared-pagination';
import { CreatePlayer } from './create-player/create-player';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import { PlayerDto } from '../../shared/models/playerDto.model';
import { ToastService } from '../../shared/services/toast.service';

@Component({
  selector: 'app-players',
  imports: [
    SharedSearch,
    SharedNoResultsFound,
    SharedPlayerSummary,
    SharedPagination,
    CreatePlayer,
  ],
  templateUrl: './players.html',
  styleUrl: './players.scss',
})
export class Players implements OnInit {
  playerService = inject(PlayerService);
  toastService = inject(ToastService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  isLoading = signal(true);
  hasError = signal(false);

  sendingPlaceholder = signal('Search player...');
  sendingQuery = signal('');
  sendingPlayers = signal<PlayerSummaryDto[]>([]);

  sendingPages = signal<number>(0);
  sendingCurrentPage = signal<number>(0);
  sendingEdited = signal(false);

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      const page = Number(params.get('page'));
      const name = params.get('playerName') ?? undefined;
      this.sendingQuery.set(`${name}?page=${page}`);

      this.playerService
        .searchPlayersBy({ name, page })
        .pipe(finalize(() => this.isLoading.set(false)))
        .subscribe({
          next: (result) => {
            this.sendingPlayers.set(result.content);
            this.sendingPages.set(result.totalPages);
            this.sendingCurrentPage.set(result.number);
          },
          error: () => this.hasError.set(true),
        });
    });
  }

  receiveSearch(name: string) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        playerName: name || null,
        page: 0,
      },
      queryParamsHandling: 'merge',
    });
  }

  receivePageChanged(page: number) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page },
      queryParamsHandling: 'merge',
    });
  }

  onModalChanged(flag: boolean) {
    console.log('modal changed', flag);
    if (flag && this.sendingEdited()) {
      this.sendingEdited.update((v) => !v);
    }
  }

  onPlayerCreated(player: PlayerDto) {
    const lastPage = this.sendingPages() - 1;
    if (this.sendingCurrentPage() === lastPage) {
      this.sendingPlayers.update((players) => {
        if (players.length < 20) {
          return [...players, player];
        } else {
          this.sendingPages.update((pages) => pages + 1);
          return players;
        }
      });
    } else {
      this.playerService.searchPlayersBy({ page: lastPage }).subscribe((result) => {
        if (result.content.length >= 20) {
          this.sendingPages.update((pages) => pages + 1);
        }
      });
    }
    this.toastService.success('Successfully created player!');
  }

  onPlayerEdited(playerId: number) {
    this.playerService.searchPlayerById(playerId).subscribe((result) => {
      this.sendingEdited.update((v) => !v);
      console.log(JSON.stringify(result, null, 2));
    });
  }

  onPlayerDeleted(playerId: number) {
    this.sendingPlayers.update((players) => players.filter((p) => p.id !== playerId));
    this.playerService.searchPlayersBy({ page: this.sendingCurrentPage() }).subscribe((result) => {
      this.sendingPlayers.set(result.content);
      this.sendingPages.set(result.totalPages);
    });
    this.toastService.success('Successfully deleted player!');
  }
}
