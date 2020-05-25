import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductSubCategory } from './product-subcategory.component';
const routes: Routes = [
    {
        path: '', component: ProductSubCategory
    }
];
export const routing: ModuleWithProviders = RouterModule.forChild(routes);