import { Routes } from '@angular/router';

export const dashboardRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./dashboard-home/dashboard-home')
        .then((m) => m.DashboardHome),
  },
  {
    path: 'assessment-list',
    loadComponent: () =>
      import('./assesment-list/assesment-list')
        .then((m) => m.AssesmentList),
  },
  {
    path: 'create-assessment',
    loadComponent: () =>
      import('./create-assessment/create-assessment')
        .then((m) => m.CreateAssessment),
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('../../features/profile/profile')
        .then((m) => m.Profile),
  }
];
