import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConsumerReturnsRoutingModule } from './consumer-returns-routing.module';
import { ConsumerReturnsComponent } from './consumer-returns.component';
import { ConsumerReturnsService } from './consumer-returns.service';

@NgModule({
  declarations: [ConsumerReturnsComponent],
  imports: [
    CommonModule,
    ConsumerReturnsRoutingModule
  ],
  providers:[ConsumerReturnsService],
  schemas:[NO_ERRORS_SCHEMA]
})
export class ConsumerReturnsModule { }
