import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReturnsRoutingModule } from './returns-routing.module';
import { ReturnsComponent } from './returns.component';
import { ReturnDataService } from './returns-data.service';

@NgModule({
  declarations: [ReturnsComponent],
  imports: [
    CommonModule,
    ReturnsRoutingModule
  ],
  providers:[ReturnDataService],
  schemas:[NO_ERRORS_SCHEMA]
})
export class ReturnsModule { }
