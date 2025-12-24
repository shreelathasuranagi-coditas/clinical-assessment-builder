import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/auth/login/login').then((m) => m.Login),
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/assesment-list/assesment-list').then((m) => m.AssesmentList),
  },
  {
    path: 'assessment/:id/details',
    loadComponent: () => import('./features/assessment-builder/assessment-details/assessment-details.component').then((m) => m.AssessmentDetailsComponent),
  },
  {
    path: 'assessment/:id/builder',
    loadComponent: () => import('./features/assessment-builder/question-builder/question-builder.component').then((m) => m.QuestionBuilderComponent),
  },
  {
    path: 'assessment/:id/preview',
    loadComponent: () => import('./features/assessment-builder/preview/preview.component').then((m) => m.PreviewComponent),
  },
];
