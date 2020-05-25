import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { caseCreation } from './caseCreation.component';
const routes: Routes = [
    {
        path: '', component: caseCreation
    }
];
export const routing: ModuleWithProviders = RouterModule.forChild(routes);