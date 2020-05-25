import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NodeMasterComponent } from './nodemaster.component';
const routes: Routes = [
    {
        path: '', component: NodeMasterComponent 
    }
];
export const routing: ModuleWithProviders = RouterModule.forChild(routes);