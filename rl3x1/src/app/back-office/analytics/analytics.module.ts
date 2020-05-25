import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AnalyticsRoutingModule } from './analytics-routing.module';
import { AnalyticsComponent } from './analytics.component';
import { AnalyticsService } from './analytics.service';
//import { StatisticsComponent } from './statistics/statistics.component';

@NgModule({
  declarations: [AnalyticsComponent],
  imports: [
    CommonModule,
    AnalyticsRoutingModule
  ],
  providers:[AnalyticsService]
})
export class AnalyticsModule { }
