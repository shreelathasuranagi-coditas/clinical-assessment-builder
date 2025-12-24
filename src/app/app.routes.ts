import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { loginRedirectGuard } from './core/guards/login-redirect-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    canActivate: [loginRedirectGuard],
    loadComponent: () =>
      import('./features/auth/login/login').then((m) => m.Login),
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/dashboard/assesment-list/assesment-list')
        .then((m) => m.AssesmentList),
  }
];

