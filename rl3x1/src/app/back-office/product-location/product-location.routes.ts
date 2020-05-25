import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductLocation } from './product-location.component';
const routes: Routes = [
    {
        path: '', component: ProductLocation 
    }
];
export const routing: ModuleWithProviders = RouterModule.forChild(routes);