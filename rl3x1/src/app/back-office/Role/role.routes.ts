import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Roles } from './role.component';
const routes: Routes = [
    {
        path: '', component: Roles 
    }
];
export const routing: ModuleWithProviders = RouterModule.forChild(routes);