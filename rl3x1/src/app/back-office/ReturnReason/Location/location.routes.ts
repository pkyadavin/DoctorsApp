import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Location } from './location.component';
const routes: Routes = [
    {
        path: '', component: Location
    }
];
export const routing: ModuleWithProviders = RouterModule.forChild(routes);