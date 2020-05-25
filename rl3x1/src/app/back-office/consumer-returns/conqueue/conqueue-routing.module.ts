import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConqueueComponent } from './conqueue.component';
import { AuthGuard } from 'src/app/auth.guard';

const routes: Routes = [
  {
    path: ":Code/:brand",
    pathMatch: "full",
    component: ConqueueComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConqueueRoutingModule { }
