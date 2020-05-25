import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConinitiateComponent } from './coninitiate.component';
import { AuthGuard } from 'src/app/auth.guard';

const routes: Routes = [
  {
    path: ":brand",
    pathMatch: "full",
    component: ConinitiateComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConinitiateRoutingModule { }
