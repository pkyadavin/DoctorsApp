import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { T3Step1Component } from './t3-step1.component';

const routes: Routes = [{ path: '', pathMatch:'full', component: T3Step1Component}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class T3Step1RoutingModule { }
