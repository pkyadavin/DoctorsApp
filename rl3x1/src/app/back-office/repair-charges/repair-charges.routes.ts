import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { repair_charges } from './repair-charges.component';
const routes: Routes = [
    {
        path: '', component: repair_charges
    }
];
export const routing: ModuleWithProviders = RouterModule.forChild(routes);