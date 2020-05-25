import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RlHomeRoutingModule } from './rl-home-routing.module';
import { RlHomeComponent } from './rl-home.component';

@NgModule({
  declarations: [RlHomeComponent],
  imports: [
    CommonModule,
    RlHomeRoutingModule
  ],
  schemas:[NO_ERRORS_SCHEMA]
})
export class RlHomeModule { }
