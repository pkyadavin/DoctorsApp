import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GraphicalComponent } from './graphical.component';
import { AuthGuard } from 'src/app/auth.guard';

const routes: Routes = [{
  path:'analytics', pathMatch:'full', component:GraphicalComponent, canActivate:[AuthGuard]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GraphicalRoutingModule { }
