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
      import('./features/auth/login/login')
        .then((m) => m.Login),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./shared/layout/main/main')
        .then((m) => m.Main),
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./features/dashboard/dashboard.routes')
            .then((m) => m.dashboardRoutes),
      },
      {
        path: 'assessment/:id',
        children: [
          {
            path: 'details',
            loadComponent: () =>
              import('./features/assessment-builder/assessment-details/assessment-details')
                .then((m) => m.AssessmentDetails),
          },
          {
            path: 'preview',
            loadComponent: () =>
              import('./features/assessment-builder/preview/preview')
                .then((m) => m.Preview),
          },
          {
            path: 'builder',
            loadComponent: () =>
              import('./features/assessment-builder/question-builder/question-builder.component')
                .then((m) => m.QuestionBuilderComponent),
          },
        ],
      },
    ],
  },
];
