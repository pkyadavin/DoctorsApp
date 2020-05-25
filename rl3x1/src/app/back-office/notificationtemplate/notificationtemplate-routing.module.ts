import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotificationTemplateGrid } from './notificationtemplate.component';


const routes: Routes = [
  { path: '', pathMatch: 'full', component: NotificationTemplateGrid}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NotificationTemplateRoutingModule { }
