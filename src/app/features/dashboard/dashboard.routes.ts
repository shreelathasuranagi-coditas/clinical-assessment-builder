import { Routes } from '@angular/router';

export const dashboardRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./assesment-list/assesment-list')
        .then((m) => m.AssesmentList),
  },
  {
    path: 'assessment-list',
    loadComponent: () =>
      import('./assesment-list/assesment-list')
        .then((m) => m.AssesmentList),
  },
];
