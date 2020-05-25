import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SalesReturnOrderGrid } from './SalesReturnOrder.component';
const routes: Routes = [
    {
        path: '_/:Scope', component: SalesReturnOrderGrid
    }
];
export const routing: ModuleWithProviders = RouterModule.forChild(routes);