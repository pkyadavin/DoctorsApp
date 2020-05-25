import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { T3TrackComponent } from './t3-track.component';

const routes: Routes = [{ path: '', pathMatch:'full', component: T3TrackComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class T3TrackRoutingModule { }
