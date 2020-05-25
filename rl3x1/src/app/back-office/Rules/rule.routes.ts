import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RuleGrid } from './rule.component';
const routes: Routes = [
    {
        path: '', component: RuleGrid
    }
];
export const routing: ModuleWithProviders = RouterModule.forChild(routes);