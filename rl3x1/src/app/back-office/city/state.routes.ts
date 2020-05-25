import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { City } from './city.component';
const routes: Routes = [
    {
        path: '', component: City 
    }
];
export const routing: ModuleWithProviders = RouterModule.forChild(routes);