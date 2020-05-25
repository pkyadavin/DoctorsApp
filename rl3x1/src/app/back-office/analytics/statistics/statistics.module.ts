import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { MessageModule } from 'src/app/controls/pop/component/message.module';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { ImageColumnComponent } from 'src/app/shared/image-column.component';

import { StatisticsRoutingModule } from './statistics-routing.module';
import { StatisticsComponent } from './statistics.component';





@NgModule({
  declarations: [StatisticsComponent],
  imports: [
    BsDatepickerModule.forRoot(),
    CommonModule,
    StatisticsRoutingModule,
    FormsModule,
    SharedModule
  
  ],
  schemas:[NO_ERRORS_SCHEMA]
})
export class StatisticsModule { }
