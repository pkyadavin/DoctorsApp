import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MRNIndex } from './index.receiving.component';
import { MRNScanEditor } from './receivingscan.component';
const routes: Routes = [
    {
        path: '', component: MRNIndex
    }    
];
export const routing: ModuleWithProviders = RouterModule.forChild(routes);