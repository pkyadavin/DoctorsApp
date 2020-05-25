import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrderSettings } from './ordersettings.component';
const routes: Routes = [
    {
        path: '', component: OrderSettings
    }
];
export const routing: ModuleWithProviders = RouterModule.forChild(routes);