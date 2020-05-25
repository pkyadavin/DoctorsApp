import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CaseAssessment } from './CaseAssessment.component';
const routes: Routes = [
    {
        path: '', component: CaseAssessment
    }
];
export const routing: ModuleWithProviders = RouterModule.forChild(routes);
