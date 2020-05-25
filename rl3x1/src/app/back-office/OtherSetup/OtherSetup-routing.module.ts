import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OtherSetupGrid } from './OtherSetup.component';


const routes: Routes = [
  { path: '', pathMatch:'full', component: OtherSetupGrid}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OtherSetupRoutingModule { }
