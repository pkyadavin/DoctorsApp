import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ModelGrid } from './category.component';
const routes: Routes = [
    {
        path: 'c', component: ModelGrid
    }
];
export const routing: ModuleWithProviders = RouterModule.forChild(routes);