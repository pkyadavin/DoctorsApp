import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Season } from './season.component';
const routes: Routes = [
    {
        path: '', component: Season 
    }
];
export const routing: ModuleWithProviders = RouterModule.forChild(routes);