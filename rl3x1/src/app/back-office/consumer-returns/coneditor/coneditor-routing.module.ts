import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConeditorComponent } from './coneditor.component';

const routes: Routes = [{
  path: ":queue/:brandCode/:order/:coTrackingNo",
  pathMatch: "full",
  component: ConeditorComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConeditorRoutingModule { }
