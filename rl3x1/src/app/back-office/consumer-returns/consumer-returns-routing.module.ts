import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConsumerReturnsComponent } from './consumer-returns.component';
import { AuthGuard } from 'src/app/auth.guard';

const routes: Routes = [
  {
    path: "",
    component: ConsumerReturnsComponent,
    children: [
      {
        path: "conqueue",
        loadChildren: "./conqueue/conqueue.module#ConqueueModule",
        canActivateChild: [AuthGuard]
      },
      {
        path: "conqueue",
        loadChildren: "./coneditor/coneditor.module#ConeditorModule",
        canActivateChild: [AuthGuard]
      },
      {
        path: "coninitiate",
        loadChildren: "./coninitiate/coninitiate.module#ConinitiateModule",
        canActivateChild: [AuthGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsumerReturnsRoutingModule { }
