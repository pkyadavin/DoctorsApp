import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserGrid } from './user-grid.component';
const routes: Routes = [
    {
        path: '', component: UserGrid 
    }
];
export const routing: ModuleWithProviders = RouterModule.forChild(routes);