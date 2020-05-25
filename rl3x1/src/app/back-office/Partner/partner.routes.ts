import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Partners } from './partnergrid.component';
const routes: Routes = [
    {
        path: '_/:ID', component: Partners 
    }
];
export const routing: ModuleWithProviders = RouterModule.forChild(routes);