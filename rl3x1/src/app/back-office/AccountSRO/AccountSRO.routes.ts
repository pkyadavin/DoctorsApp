import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SROrderList } from './SROList.component';
const routes: Routes = [
    {
        path: ':Scope', component: SROrderList
    }
];
export const routing: ModuleWithProviders = RouterModule.forChild(routes);