import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Orders } from './Orders.component';
const routes: Routes = [
    {
        path: '', component: Orders
    }
];
export const routing: ModuleWithProviders = RouterModule.forChild(routes);
