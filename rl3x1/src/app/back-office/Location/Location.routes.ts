import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LocationGrid } from './Location.component';
const routes: Routes = [
    {
        path: '', component: LocationGrid
    }
];
export const routing: ModuleWithProviders = RouterModule.forChild(routes);