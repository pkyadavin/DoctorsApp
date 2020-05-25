import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { T3Step3RoutingModule } from './t3-step3-routing.module';
import { T3Step3Component } from './t3-step3.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule } from '@angular/forms';
import { NgxPrintModule } from 'ngx-print';

@NgModule({
  declarations: [T3Step3Component],
  imports: [
    T3Step3RoutingModule,
    CommonModule,
    SharedModule,
    NgxPrintModule,
    FormsModule,
    NgxUiLoaderModule
  ],
  schemas:[NO_ERRORS_SCHEMA]
})
export class T3Step3Module { }
