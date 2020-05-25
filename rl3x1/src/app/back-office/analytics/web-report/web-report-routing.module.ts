import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WebReportComponent } from './web-report.component';
import { AuthGuard } from 'src/app/auth.guard';

const routes: Routes = [{
  path:':Code', pathMatch:'full', component:WebReportComponent, canActivate:[AuthGuard]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WebReportRoutingModule { }
