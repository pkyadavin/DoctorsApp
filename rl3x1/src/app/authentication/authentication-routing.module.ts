import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import{AuthenticationComponent} from './authentication.component'

const routes: Routes = [
  {
    path: 'auth', 
      component: AuthenticationComponent,
      children: [       
        { path: 'login', loadChildren: './login/login.module#LoginModule'}, 
        { path: 'password', loadChildren: './password/password.module#PasswordModule'}, 
        // { path: 'resetpwd:code', loadChildren: './resetpassword/resetpassword.module#ResetpasswordModule'}, 
      ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthenticationRoutingModule { }
