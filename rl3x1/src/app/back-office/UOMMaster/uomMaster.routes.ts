import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UOMMasterGrid } from './uomMaster.component';
const routes: Routes = [
    {
        path: '', component: UOMMasterGrid
    }
];
export const routing: ModuleWithProviders = RouterModule.forChild(routes);