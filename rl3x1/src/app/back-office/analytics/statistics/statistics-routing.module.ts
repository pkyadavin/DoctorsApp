import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StatisticsComponent } from './statistics.component';
import { AuthGuard } from 'src/app/auth.guard';

const routes: Routes = [{
  path:'stat', pathMatch:'full', component:StatisticsComponent, canActivate:[AuthGuard]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StatisticsRoutingModule { }
