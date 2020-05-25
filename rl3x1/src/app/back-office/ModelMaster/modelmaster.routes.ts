import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ModelMasterGrid } from './modelmaster.component';

const routes: Routes = [
    {
        path: 'mm', component: ModelMasterGrid
    }
];
export const routing: ModuleWithProviders = RouterModule.forChild(routes);