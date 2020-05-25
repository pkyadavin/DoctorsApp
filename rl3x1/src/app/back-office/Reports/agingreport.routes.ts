import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AgingReportGrid } from './agingreport.component';
const routes: Routes = [
    {
        path: 'ar', component: AgingReportGrid
    }
];
export const routing: ModuleWithProviders = RouterModule.forChild(routes);