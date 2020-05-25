import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReturnReasonGrid } from './returnreason.component';
const routes: Routes = [
    {
        path: 'customer/:Scope', component: ReturnReasonGrid
    },
    {
        path: 'account/:Scope', component: ReturnReasonGrid
    }
];
export const routing: ModuleWithProviders = RouterModule.forChild(routes);