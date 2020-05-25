import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { T3Step3Component } from './t3-step3.component';

const routes: Routes = [{ path: '', pathMatch:'full', component: T3Step3Component}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class T3Step3RoutingModule { }
