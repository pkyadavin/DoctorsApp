import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductGrade } from './product-grade.component';
const routes: Routes = [
    {
        path: '', component: ProductGrade
    }
];
export const routing: ModuleWithProviders = RouterModule.forChild(routes);