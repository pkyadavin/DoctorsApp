import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Issue } from './issue.component';
const routes: Routes = [
    {
        path: '', component: Issue
    }
];
export const routing: ModuleWithProviders = RouterModule.forChild(routes);