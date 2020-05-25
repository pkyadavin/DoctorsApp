import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductCategory } from './product-category.component';
const routes: Routes = [
    {
        path: '', component: ProductCategory
    }
];
export const routing: ModuleWithProviders = RouterModule.forChild(routes);