import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TenantVerificationComponent } from './tenantverification.component';
const routes: Routes = [{ path: '', pathMatch:'full', component: TenantVerificationComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LeadVerificationRoutingModule { }
