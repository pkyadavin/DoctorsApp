import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RootCause } from './RootCause.component';
const routes: Routes = [
    {
        path: '', component: RootCause 
    }
];
export const routing: ModuleWithProviders = RouterModule.forChild(routes);