import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GaeditorComponent } from './gaeditor.component';

const routes: Routes = [{
  path: ":queue/:brandCode/:order/:coTrackingNo",
  pathMatch: "full",
  component: GaeditorComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GaeditorRoutingModule { }
