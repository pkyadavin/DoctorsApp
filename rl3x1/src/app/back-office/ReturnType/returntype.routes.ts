import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReturnTypeComponent } from './returntype.component';
const routes: Routes = [
    {
        path: '', component: ReturnTypeComponent
    }
];
export const routing: ModuleWithProviders = RouterModule.forChild(routes);