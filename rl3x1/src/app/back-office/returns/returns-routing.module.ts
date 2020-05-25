import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReturnsComponent } from './returns.component';
import { AuthGuard } from 'src/app/auth.guard';

const routes: Routes = [
  {path: '', 
        component: ReturnsComponent,
        children: [
          { path: 'initiate', loadChildren: './lookup/lookup.module#LookupModule', canActivateChild:[AuthGuard]},
          { path: 'queue', loadChildren: './queue/queue.module#GnQueueModule', canActivateChild:[AuthGuard]},
          { path: 'queue', loadChildren: './order/order.module#OrderModule', canActivateChild:[AuthGuard]},
          { path: 'confirmation', loadChildren: './confirmation/confirmation.module#ConfirmModule'},
        ]
      },      
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReturnsRoutingModule { }
