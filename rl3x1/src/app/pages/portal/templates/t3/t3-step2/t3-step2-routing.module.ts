import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { T3Step2Component } from './t3-step2.component';

const routes: Routes = [{ path: '', pathMatch:'full', component: T3Step2Component}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class T3Step2RoutingModule { }
