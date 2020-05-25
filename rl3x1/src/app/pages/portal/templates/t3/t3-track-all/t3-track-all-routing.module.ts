import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { T3TrackAllComponent } from './t3-track-all.component';

const routes: Routes = [{ path: '', pathMatch:'full', component: T3TrackAllComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class T3TrackAllRoutingModule { }
