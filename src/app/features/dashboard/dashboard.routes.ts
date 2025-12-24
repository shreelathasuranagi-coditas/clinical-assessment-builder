import { Routes } from "@angular/router";

export const dashboardRoutes: Routes = [
    {
        path: 'assessment-list',
        loadComponent: () =>
            import('./assesment-list/assesment-list').then((m) => m.AssesmentList),
    },
    {
        path: 'create-assessment',
        loadComponent: () =>
            import('./create-assessment/create-assessment').then((m) => m.CreateAssessment),
    }
]