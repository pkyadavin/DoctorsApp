import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Regions } from './region.component';
const routes: Routes = [
    {
        path: '', component: Regions 
    }
];
export const routing: ModuleWithProviders = RouterModule.forChild(routes);