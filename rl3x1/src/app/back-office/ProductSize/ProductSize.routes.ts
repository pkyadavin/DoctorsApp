import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductSize } from './ProductSize.component';
const routes: Routes = [
    {
        path: '', component: ProductSize
    }
];
export const routing: ModuleWithProviders = RouterModule.forChild(routes);
