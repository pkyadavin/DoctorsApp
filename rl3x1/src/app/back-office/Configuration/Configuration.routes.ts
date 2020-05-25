import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Configuration } from './Configuration.component';
const routes: Routes = [
    {
        path: '', component: Configuration
    }
];
export const routing: ModuleWithProviders = RouterModule.forChild(routes);
