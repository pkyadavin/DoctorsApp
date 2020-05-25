import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CaseValidationComponent } from './case-validation.component';
const routes: Routes = [
  {
    path: '', component: CaseValidationComponent
  }
];
export const routing: ModuleWithProviders = RouterModule.forChild(routes);
