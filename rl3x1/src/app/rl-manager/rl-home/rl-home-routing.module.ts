import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RlHomeComponent } from './rl-home.component';

const routes: Routes = [{ path: '', pathMatch:'full', component: RlHomeComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RlHomeRoutingModule { }
