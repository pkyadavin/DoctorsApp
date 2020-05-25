import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LanguageRoutingModule } from './language-routing.module';
import { LanguageComponent } from './language.component';
import { LanguageService } from './language.service';
import { FormsModule } from '@angular/forms';
import { AnalyticsService } from '../analytics/analytics.service';

@NgModule({
  declarations: [LanguageComponent],
  imports: [
    FormsModule,
    CommonModule,
    LanguageRoutingModule
  ],
  providers: [LanguageService, AnalyticsService],
  schemas:[NO_ERRORS_SCHEMA]

})
export class LanguageModule { }
