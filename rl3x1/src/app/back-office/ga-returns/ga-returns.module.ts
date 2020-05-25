import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GaReturnsRoutingModule } from './ga-returns-routing.module';
import { GaReturnsService } from './ga_returns.service';
import { GaReturnsComponent } from './ga-returns.component';

@NgModule({
  declarations: [GaReturnsComponent],
  imports: [
    CommonModule,
    GaReturnsRoutingModule
  ],
  providers:[GaReturnsService],
  schemas:[NO_ERRORS_SCHEMA]
})
export class GaReturnsModule { }
