import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MessageTemplateGrid } from './messageTemplate.component';
const routes: Routes = [
    {
        path: '', component: MessageTemplateGrid 
    }
];
export const routing: ModuleWithProviders = RouterModule.forChild(routes);