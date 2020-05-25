import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PortalComponent } from './portal.component';

const routes: Routes = [{ path: '', component: PortalComponent,
children: [       
  { path: 'res', loadChildren: './templates/templates.module#TemplatesModule'},
  { path: '404', loadChildren: './page404/page404.module#Page404Module'},
]}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PortalRoutingModule { }
