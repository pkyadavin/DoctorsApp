import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WebReportRoutingModule } from './web-report-routing.module';
import { WebReportComponent } from './web-report.component';
import { AnalyticsService } from '../analytics.service';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { MessageModule } from 'src/app/controls/pop/component/message.module';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { ImageColumnComponent } from 'src/app/shared/image-column.component';
import { AgGridModule } from 'ag-grid-angular';

@NgModule({
  declarations: [WebReportComponent],
  imports: [
    BsDatepickerModule.forRoot(),
    MessageModule, 
    AgGridModule.withComponents(
      [
          ImageColumnComponent
      ]),
    FormsModule, 
    SharedModule,
    CommonModule,
    WebReportRoutingModule,

  ],
  providers:[AnalyticsService],
  schemas:[NO_ERRORS_SCHEMA]
})
export class WebReportModule { }
