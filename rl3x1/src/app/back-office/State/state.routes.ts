import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { State } from './state.component';
const routes: Routes = [
    {
        path: '', component: State 
    }
];
export const routing: ModuleWithProviders = RouterModule.forChild(routes);