import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShipmentOrder } from './shipment.component';
const routes: Routes = [
    {
        path: '', component: ShipmentOrder
    }
];
export const routing: ModuleWithProviders = RouterModule.forChild(routes);