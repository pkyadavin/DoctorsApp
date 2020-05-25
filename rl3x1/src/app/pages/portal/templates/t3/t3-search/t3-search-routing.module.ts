import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { T3SearchComponent } from './t3-search.component';

const routes: Routes = [{ path: '', pathMatch:'full', component: T3SearchComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class T3SearchRoutingModule { }
