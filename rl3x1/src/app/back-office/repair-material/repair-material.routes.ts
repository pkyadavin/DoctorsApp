import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RepairMaterial } from './repair-material.component';
const routes: Routes = [
    {
        path: '', component: RepairMaterial 
    }
];
export const routing: ModuleWithProviders = RouterModule.forChild(routes);