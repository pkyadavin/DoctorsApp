import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { B2BUser } from './B2BUser.component';
const routes: Routes = [
    {
        path: '', component: B2BUser
    }
];
export const routing: ModuleWithProviders = RouterModule.forChild(routes);