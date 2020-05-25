import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductPriceList } from './ProductPriceList.component';
const routes: Routes = [
    {
        path: '', component: ProductPriceList
    }
];
export const routing: ModuleWithProviders = RouterModule.forChild(routes);
