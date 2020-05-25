import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Color } from './color.component';
const routes: Routes = [
    {
        path: '', component: Color 
    }
];
export const routing: ModuleWithProviders = RouterModule.forChild(routes);