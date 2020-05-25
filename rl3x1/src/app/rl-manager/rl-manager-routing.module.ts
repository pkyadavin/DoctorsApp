import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {RlManagerComponent} from './rl-manager.component'
import{AuthGuard} from '../auth.guard'

const routes: Routes = [ 
  {
    path: '', 
      component: RlManagerComponent,
      children: [
        { path: 'home', loadChildren: './rl-home/rl-home.module#RlHomeModule'},
        //{ path: 'home', loadChildren: './Tenant/tenant.module#TenantModule'},
        { path: 'Tenants', loadChildren: './Tenant/tenant.module#TenantModule', canActivateChild:[AuthGuard]},
        { path: 'role', loadChildren: '../back-office/Role/role.module#RoleModule', canActivateChild:[AuthGuard] },
        { path: 'fuser/PTR', loadChildren: '../back-office/user/user.module#UserModule', canActivateChild:[AuthGuard] }, 
        { path: 'notificationtemplate', loadChildren: '../back-office/notificationtemplate/notificationtemplate.module#NotificationTemplateModule', canActivateChild:[AuthGuard] },
        { path: 'messageSetUp', loadChildren: '../back-office/MessagingTemplate/messageTemplate.module#MessageTemplateModule', canActivateChild:[AuthGuard] },
      ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RlManagerRoutingModule { }
