import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ItemCategoryComponent } from './itemcategory.component';
const routes: Routes = [
    {
        path: 'ic', component: ItemCategoryComponent
    }
];
export const routing: ModuleWithProviders = RouterModule.forChild(routes);