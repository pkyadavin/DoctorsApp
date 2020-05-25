import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductGrouping } from './product-grouping.component';
const routes: Routes = [
    {
        path: '', component: ProductGrouping
    }
];
export const routing: ModuleWithProviders = RouterModule.forChild(routes);