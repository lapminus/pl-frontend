import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => {
      return import('./features/players/players').then((m) => m.Players);
    },
  },
  {
    path: 'players',
    loadComponent: () => {
      return import('./features/players/players').then((m) => m.Players);
    },
  },
  {
    path: 'teams',
    loadComponent: () => {
      return import('./features/teams/teams').then((m) => m.Teams);
    },
  },
  {
    path: 'nations',
    loadComponent: () => {
      return import('./features/nations/nations').then((m) => m.Nations);
    },
  },
  {
    path: 'positions',
    loadComponent: () => {
      return import('./features/positions/positions').then((m) => m.Positions);
    },
  },
];
