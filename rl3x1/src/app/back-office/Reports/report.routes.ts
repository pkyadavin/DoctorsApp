import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
//import { AgingReportGrid } from './agingreport.component';
import { InvenoryReportComponent } from './Inventory/inventory.component';
const routes: Routes = [
    {
        path: 'irc', component: InvenoryReportComponent
        
    }
    //, {
    //    path: '', component: AgingReportGrid

    //}
];
export const routing: ModuleWithProviders = RouterModule.forChild(routes);