import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManufacturerComponent } from './Manufacturer.component';
const routes: Routes = [
    {
        path: '', component: ManufacturerComponent
    }
];
export const routing: ModuleWithProviders = RouterModule.forChild(routes);