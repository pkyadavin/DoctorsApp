import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Country } from './country.component';
const routes: Routes = [
    {
        path: '', component: Country
    }
];
export const routing: ModuleWithProviders = RouterModule.forChild(routes);