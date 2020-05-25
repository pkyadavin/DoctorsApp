import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConfirmationComponent } from './confirmation.component';
import { AuthGuard } from 'src/app/auth.guard';

const routes: Routes = [{
  path:':brandCode/:Code', pathMatch:'full', component:ConfirmationComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfirmationRoutingModule { }
