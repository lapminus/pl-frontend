import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { PlayerDto } from '../models/playerDto.model';
import { Observable } from 'rxjs';
import { Page } from '../models/page.type';
import { PlayerSearchParams } from '../models/filter.type';
@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  private baseUrl = 'http://localhost:8080/api/v1/players';
  private teams = '/teams';
  private nations = '/nations';
  private positions = '/positions';

  http = inject(HttpClient);

  searchPlayersBy(filters: PlayerSearchParams): Observable<Page<PlayerDto>> {
    let params = new HttpParams();
    params = params.set('page', filters.page ?? 0);
    params = params.set('size', filters.size ?? 20);

    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params = params.set(key, value);
      }
    });
    return this.http.get<Page<PlayerDto>>(this.baseUrl, { params });
  }

  searchPlayerById(playerId: number): Observable<PlayerDto> {
    return this.http.get<PlayerDto>(this.baseUrl + `/${playerId}`);
  }

  getAllTeamNames(): Observable<string[]> {
    return this.http.get<string[]>(this.baseUrl + this.teams);
  }

  getAllNations(): Observable<string[]> {
    return this.http.get<string[]>(this.baseUrl + this.nations);
  }

  getAllPositions(): Observable<string[]> {
    return this.http.get<string[]>(this.baseUrl + this.positions);
  }

  // @PostMapping
  // public ResponseEntity<PlayerDto> createPlayer(
  //         @Valid @RequestBody PlayerDto dto) {
  //     Player player = playerService.createPlayer(playerMapper.toEntity(dto));
  //     return new ResponseEntity<>(playerMapper.toDto(player), HttpStatus.CREATED);
  // }
  createPlayer(dto: PlayerDto): Observable<PlayerDto> {
    return this.http.post<PlayerDto>(this.baseUrl, dto);
  }
}
