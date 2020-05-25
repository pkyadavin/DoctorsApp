import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RMAActionCodeGrid } from './rmaactioncode-grid.component';
const routes: Routes = [
    {
        path: '', component: RMAActionCodeGrid
    }
];
export const routing: ModuleWithProviders = RouterModule.forChild(routes);