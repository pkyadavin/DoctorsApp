import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import{ResetpasswordComponent} from './resetpassword.component'

const routes: Routes = [
  { path: ':code', pathMatch:'full', component: ResetpasswordComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResetPwdRoutingModule { }
