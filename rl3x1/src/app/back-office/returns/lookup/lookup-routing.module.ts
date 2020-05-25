import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LookupComponent } from './lookup.component';
import { AuthGuard } from 'src/app/auth.guard';

const routes: Routes = [{
  path:':brandCode', pathMatch:'full', component:LookupComponent, canActivate:[AuthGuard]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LookupRoutingModule { }
