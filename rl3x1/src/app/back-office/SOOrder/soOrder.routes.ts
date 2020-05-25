import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SOOrdersGrid } from './soOrder.component';
const routes: Routes = [
    {
        path: '', component: SOOrdersGrid
    }
];
export const routing: ModuleWithProviders = RouterModule.forChild(routes);