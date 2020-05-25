import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductCatalog } from './ProductCatalog.component';
const routes: Routes = [
    {
        path: '', component: ProductCatalog
    }
];
export const routing: ModuleWithProviders = RouterModule.forChild(routes);
