import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AnalyticsService } from '../analytics.service';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { MessageModule } from 'src/app/controls/pop/component/message.module';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';

import { GraphicalRoutingModule } from './graphical-routing.module';
import { GraphicalComponent } from './graphical.component';
import { ChartModule, HIGHCHARTS_MODULES  } from 'angular-highcharts';
import * as highmaps from 'highcharts/modules/map.src';
import { HighchartsChartModule } from '../../../../app/highcharts-angular/src/lib/highcharts-chart.module';
@NgModule({
  declarations: [GraphicalComponent],
  imports: [
    HighchartsChartModule,
    ChartModule,
    CommonModule,
    GraphicalRoutingModule,
    BsDatepickerModule.forRoot(),
    MessageModule,
    FormsModule, 
    SharedModule,
    CommonModule
  ],
  providers:[AnalyticsService, { provide: HIGHCHARTS_MODULES, useFactory: () => [ highmaps ] }],
  schemas:[NO_ERRORS_SCHEMA]
})
export class GraphicalModule { }
