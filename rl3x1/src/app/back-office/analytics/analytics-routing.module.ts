import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AnalyticsComponent } from './analytics.component';
import { AuthGuard } from 'src/app/auth.guard';

const routes: Routes = [{path: '', 
component: AnalyticsComponent,
children: [
  { path: 'web', loadChildren: './web-report/web-report.module#WebReportModule', canActivateChild:[AuthGuard]}, 
  { path: 'graphical', loadChildren: './graphical/graphical.module#GraphicalModule', canActivateChild:[AuthGuard]}, 
  { path: 'statistics', loadChildren: './statistics/statistics.module#StatisticsModule', canActivateChild:[AuthGuard]},   
]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnalyticsRoutingModule { }
