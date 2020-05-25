import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { repair_resolution } from './repair-resolution.component';
const routes: Routes = [
    {
        path: '', component: repair_resolution
    }
];
export const routing: ModuleWithProviders = RouterModule.forChild(routes);